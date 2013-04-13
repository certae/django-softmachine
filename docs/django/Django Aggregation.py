Django


Aggregation

Sometimes you will need to retrieve values that are derived by summarizing or aggregating a collection of objects.
This topic guide describes the ways that aggregate values can be generated and returned using Django queries.

Throughout this guide, we’ll refer to the following models. 
These models are used to track the inventory for a series of online bookstores:

class Author(models.Model):
   name = models.CharField(max_length=100)
   age = models.IntegerField()

class Publisher(models.Model):
   name = models.CharField(max_length=300)
   num_awards = models.IntegerField()

class Book(models.Model):
   name = models.CharField(max_length=300)
   pages = models.IntegerField()
   price = models.DecimalField(max_digits=10, decimal_places=2)
   rating = models.FloatField()
   authors = models.ManyToManyField(Author)
   publisher = models.ForeignKey(Publisher)
   pubdate = models.DateField()

class Store(models.Model):
   name = models.CharField(max_length=300)
   books = models.ManyToManyField(Book)
   registered_users = models.PositiveIntegerField()


#---------------

# Total number of books.
>>> Book.objects.count()

# Total number of books with publisher=BaloneyPress
>>> Book.objects.filter(publisher__name='BaloneyPress').count()


# Average price across all books.
>>> from django.db.models import Avg
>>> Book.objects.all().aggregate(Avg('price'))
{'price__avg': 34.35}

# Max price across all books.
>>> from django.db.models import Max
>>> Book.objects.all().aggregate(Max('price'))
{'price__max': Decimal('81.20')}

>>> from django.db.models import Avg, Max, Min, Count
>>> Book.objects.aggregate(Avg('price'), Max('price'), Min('price'))
{'price__avg': 34.35, 'price__max': Decimal('81.20'), 'price__min': Decimal('12.99')}

# ----------------------------

# All the following queries involve traversing the Book<->Publisher
# many-to-many relationship backward

# Each publisher, each with a count of books as a "num_books" attribute.
>>> from django.db.models import Count
>>> pubs = Publisher.objects.annotate(num_books=Count('book'))
>>> pubs
[<Publisher BaloneyPress>, <Publisher SalamiPress>, ...]
>>> pubs[0].num_books
73

# The top 5 publishers, in order by number of books.
>>> pubs = Publisher.objects.annotate(num_books=Count('book')).order_by('-num_books')[:5]
>>> pubs[0].num_books
1323

# ----------------------------

Generating aggregates for each item in a QuerySet
The second way to generate summary values is to generate an independent summary for each object in a QuerySet. For example, if you are retrieving a list of books, you may want to know how many authors contributed to each book. Each Book has a many-to-many relationship with the Author; we want to summarize this relationship for each book in the QuerySet.

Per-object summaries can be generated using the annotate() clause. When an annotate() clause is specified, each object in the QuerySet will be annotated with the specified values.

The syntax for these annotations is identical to that used for the aggregate() clause. Each argument to annotate() describes an aggregate that is to be calculated. For example, to annotate books with the number of authors:

# Build an annotated queryset
>>> q = Book.objects.annotate(Count('authors'))
# Interrogate the first object in the queryset
>>> q[0]
<Book: The Definitive Guide to Django>
>>> q[0].authors__count
2
# Interrogate the second object in the queryset
>>> q[1]
<Book: Practical Django Projects>
>>> q[1].authors__count
1

# Joins and aggregates
So far, we have dealt with aggregates over fields that belong to the model being queried. However, sometimes the value you want to aggregate will belong to a model that is related to the model you are querying.

When specifying the field to be aggregated in an aggregate function, Django will allow you to use the same double underscore notation that is used when referring to related fields in filters. Django will then handle any table joins that are required to retrieve and aggregate the related value.

For example, to find the price range of books offered in each store, you could use the annotation:

>>> Store.objects.annotate(min_price=Min('books__price'), max_price=Max('books__price'))
This tells Django to retrieve the Store model, join (through the many-to-many relationship) with the Book model, and aggregate on the price field of the book model to produce a minimum and maximum value.

The same rules apply to the aggregate() clause. If you wanted to know the lowest and highest price of any book that is available for sale in a store, you could use the aggregate:

>>> Store.objects.aggregate(min_price=Min('books__price'), max_price=Max('books__price'))
Join chains can be as deep as you require. For example, to extract the age of the youngest author of any book available for sale, you could issue the query:

>>> Store.objects.aggregate(youngest_age=Min('books__authors__age'))


# ----------------------------


DIFF ANNOTATE AGGREGATE 

Unlike aggregate(), annotate() is not a terminal clause. 
The output of the annotate() clause is a QuerySet; this QuerySet can be modified using any other QuerySet operation, including filter(), order_by(), or even additional calls to annotate().

# --------------------------------------------------

A ( Author ) 
B ( Book ) 

from django.db.models import Count
cats = A.objects.annotate(num_b=Count('b')).filter(num_b__lt=2)

In my case I had to take this concept a step further. My "B" object had a boolean field called is_available, and I only wanted to return A objects who had more than 0 B objects with is_available set to True.

A.objects.filter(
		B__is_available=True
		).annotate( num_b=Count('b')
		).filter( num_b__gt=0
		).order_by('-num_items'
		)