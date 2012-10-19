# -*- coding: utf-8 -*-

fieldsets = (
    (None,
        {'fields': [('nom', 'famille', 'typeLogiciel' 
                     ), ]
         }),
    ('Description',
        {'fields': [('description',),
                    ('categorie', 'fonction', 'dureeCycle',),
                    ('nature', 'editeur', 'coutDeIntroduction'),
                    ('commentaire',),
                    ],
         'classes': ['collapse']
         }),
             )


def main():

    for name, opts in fieldsets:
        for field in opts['fields']:
            # type checking feels dirty, but it seems like the best way here
            if type(field) == tuple:
                field_names.extend(field)
            else:
                field_names.append(field)

    
    # In order to see the application
    sys.exit(system.exec_())
    
if __name__ == "__main__":
    main()
