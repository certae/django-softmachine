<map version="0.9.0">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node CREATED="1351377136644" ID="ID_1629252968" MODIFIED="1351883978373" TEXT="Actions">
<node CREATED="1351377961011" FOLDED="true" ID="ID_1506617092" MODIFIED="1351884078020" POSITION="right" TEXT="Como implemetarlos">
<node CREATED="1351377971198" ID="ID_1328744298" MODIFIED="1351378179298">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Habra una vista generica de acciones,
    </p>
    <p>
      
    </p>
    <p>
      se el envia la accion, el modelo a partir del cual se realiza la accion y la lista de ids
    </p>
    <p>
      la vista construe un QSet y lo envia a la accion declarada;&#160;
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1351378138640" ID="ID_16095163" MODIFIED="1351378144201" TEXT="Parametros adicionales">
<node CREATED="1351378163305" ID="ID_1638440659" MODIFIED="1351378166219" TEXT="puden pedir parametros adicionales, una ventana generica con la lista de los parametros, o una funcion q pueda leerlos de la forma o de la grilla. "/>
</node>
<node CREATED="1351378181828" ID="ID_1312855207" MODIFIED="1351378183919" TEXT="puede retornar un estado y/o refrescar la grilla."/>
</node>
<node CREATED="1351377169453" ID="ID_1266028467" MODIFIED="1351377174741" POSITION="right" TEXT="Django">
<node CREATED="1351377229419" FOLDED="true" ID="ID_1232764964" MODIFIED="1351873719355" TEXT="Como se definien">
<node CREATED="1351377240101" ID="ID_1122347329" MODIFIED="1351377859959">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Las acciones son funciones definidas en admin.py
    </p>
    <ul>
      <li>
        si se definen a nivel del modulo admin, la accion es una referencia al metodo,
      </li>
      <li>
        si se definen dentro del admin, es un string con el nombre del metodo&#160;
      </li>
      <li>
        Podrian tambien ser metodos de cada modelo, en este caso serian&#160;&#160;a nivel de registro y es mas generico manejar un QSet
      </li>
      <li>
        tienen 3 parametros model_admin, request, queryset
      </li>
      <li>
        En mi caso &#160;el QSet se prepara con los id de los registros seleccionados,
      </li>
    </ul>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351377775037" FOLDED="true" ID="ID_768729252" MODIFIED="1351872534067" TEXT="Globales ( genericas ) ">
<node CREATED="1351377784825" ID="ID_13257224" MODIFIED="1351377795053">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Las acciones declaras como globales son heredadas por todos los objetos,
    </p>
    <p>
      
    </p>
    <p>
      admin.site.add_action(export_selected_objects)
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351378231321" FOLDED="true" ID="ID_476293964" MODIFIED="1351872676895" TEXT="Ejemplos">
<node CREATED="1351378282699" FOLDED="true" ID="ID_100421203" MODIFIED="1351378494379" TEXT="modulo">
<node CREATED="1351378290925" ID="ID_85238906" MODIFIED="1351378320800">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <pre style="border-left-width: 0px; font-style: normal; background-attachment: scroll; background-position: initial initial; letter-spacing: normal; text-transform: none; background-repeat: repeat; padding-bottom: 0; border-top-width: 1px; padding-top: 0; margin-right: 0px; word-spacing: 0px; margin-bottom: 0; border-right-width: 0px; color: rgb(0, 0, 0); font-variant: normal; line-height: 16px; padding-left: 0; font-size: medium; text-align: -webkit-auto; margin-left: 0px; margin-top: 0; font-weight: normal; border-bottom-width: 1px; padding-right: 0; background-image: initial; background-color: rgb(255, 255, 255); text-indent: 0px" http-equiv="content-type" content="text/html; charset=utf-8"><span style="margin-right: 0px; margin-left: 0px" class="kn">from</span> <span style="margin-right: 0px; color: rgb(85, 85, 85); margin-left: 0px" class="nn"><font color="rgb(85, 85, 85)">django.contrib</font></span> <span style="margin-right: 0px; margin-left: 0px" class="kn">import</span> <span style="margin-right: 0px; margin-left: 0px" class="n">admin</span>
<span style="margin-right: 0px; margin-left: 0px" class="kn">from</span> <span style="margin-right: 0px; color: rgb(85, 85, 85); margin-left: 0px" class="nn"><font color="rgb(85, 85, 85)">myapp.models</font></span> <span style="margin-right: 0px; margin-left: 0px" class="kn">import</span> <span style="margin-right: 0px; margin-left: 0px" class="n">Article</span>

<b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="k">def</span></b> <b><span style="margin-right: 0px; color: rgb(153, 0, 0); margin-left: 0px; font-weight: bold" class="nf"><font color="rgb(153, 0, 0)">make_published</font></span></b><span style="margin-right: 0px; margin-left: 0px" class="p">(</span><span style="margin-right: 0px; margin-left: 0px" class="n">modeladmin</span><span style="margin-right: 0px; margin-left: 0px" class="p">,</span> <span style="margin-right: 0px; margin-left: 0px" class="n">request</span><span style="margin-right: 0px; margin-left: 0px" class="p">,</span> <span style="margin-right: 0px; margin-left: 0px" class="n">queryset</span><span style="margin-right: 0px; margin-left: 0px" class="p">):</span>
    <span style="margin-right: 0px; margin-left: 0px" class="n">queryset</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">update</span><span style="margin-right: 0px; margin-left: 0px" class="p">(</span><span style="margin-right: 0px; margin-left: 0px" class="n">status</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b><span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">'p'</font></span><span style="margin-right: 0px; margin-left: 0px" class="p">)</span>
<span style="margin-right: 0px; margin-left: 0px" class="n">make_published</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">short_description</span> <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b> <span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">&quot;Mark selected stories as published&quot;</font></span>

<b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="k">class</span></b> <b><span style="margin-right: 0px; color: rgb(68, 85, 136); margin-left: 0px; font-weight: bold" class="nc"><font color="rgb(68, 85, 136)">ArticleAdmin</font></span></b><span style="margin-right: 0px; margin-left: 0px" class="p">(</span><span style="margin-right: 0px; margin-left: 0px" class="n">admin</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">ModelAdmin</span><span style="margin-right: 0px; margin-left: 0px" class="p">):</span>
    <span style="margin-right: 0px; margin-left: 0px" class="n">list_display</span> <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b> <span style="margin-right: 0px; margin-left: 0px" class="p">[</span><span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">'title'</font></span><span style="margin-right: 0px; margin-left: 0px" class="p">,</span> <span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">'status'</font></span><span style="margin-right: 0px; margin-left: 0px" class="p">]</span>
    <span style="margin-right: 0px; margin-left: 0px" class="n">ordering</span> <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b> <span style="margin-right: 0px; margin-left: 0px" class="p">[</span><span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">'title'</font></span><span style="margin-right: 0px; margin-left: 0px" class="p">]</span>
    <span style="margin-right: 0px; margin-left: 0px" class="n">actions</span> <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b> <span style="margin-right: 0px; margin-left: 0px" class="p">[</span><span style="margin-right: 0px; margin-left: 0px" class="n">make_published</span><span style="margin-right: 0px; margin-left: 0px" class="p">]</span>

<span style="margin-right: 0px; margin-left: 0px" class="n">admin</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">site</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">register</span><span style="margin-right: 0px; margin-left: 0px" class="p">(</span><span style="margin-right: 0px; margin-left: 0px" class="n">Article</span><span style="margin-right: 0px; margin-left: 0px" class="p">,</span> <span style="margin-right: 0px; margin-left: 0px" class="n">ArticleAdmin</span></pre>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351378428947" FOLDED="true" ID="ID_89759255" MODIFIED="1351378489364" TEXT="model_admin">
<node CREATED="1351378438787" ID="ID_1111673020" MODIFIED="1351378487708">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <pre style="border-left-width: 0px; font-style: normal; background-attachment: scroll; background-position: initial initial; letter-spacing: normal; text-transform: none; background-repeat: repeat; padding-bottom: 0; border-top-width: 1px; padding-top: 0; margin-right: 0px; word-spacing: 0px; margin-bottom: 0; border-right-width: 0px; color: rgb(0, 0, 0); font-variant: normal; line-height: 16px; padding-left: 0; font-size: medium; text-align: -webkit-auto; margin-left: 0px; margin-top: 0; font-weight: normal; border-bottom-width: 1px; padding-right: 0; background-image: initial; background-color: rgb(255, 255, 255); text-indent: 0px" http-equiv="content-type" content="text/html; charset=utf-8"><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="k">class</span></b> <b><span style="margin-right: 0px; color: rgb(68, 85, 136); margin-left: 0px; font-weight: bold" class="nc"><font color="rgb(68, 85, 136)">ArticleAdmin</font></span></b><span style="margin-right: 0px; margin-left: 0px" class="p">(</span><span style="margin-right: 0px; margin-left: 0px" class="n">admin</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">ModelAdmin</span><span style="margin-right: 0px; margin-left: 0px" class="p">):</span>
    <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">...</span></b>

    <span style="margin-right: 0px; margin-left: 0px" class="n">actions</span> <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b> <span style="margin-right: 0px; margin-left: 0px" class="p">[</span><span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">'make_published'</font></span><span style="margin-right: 0px; margin-left: 0px" class="p">]</span>

    <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="k">def</span></b> <b><span style="margin-right: 0px; color: rgb(153, 0, 0); margin-left: 0px; font-weight: bold" class="nf"><font color="rgb(153, 0, 0)">make_published</font></span></b><span style="margin-right: 0px; margin-left: 0px" class="p">(</span><span style="margin-right: 0px; color: rgb(153, 153, 153); margin-left: 0px" class="bp"><font color="rgb(153, 153, 153)">self</font></span><span style="margin-right: 0px; margin-left: 0px" class="p">,</span> <span style="margin-right: 0px; margin-left: 0px" class="n">request</span><span style="margin-right: 0px; margin-left: 0px" class="p">,</span> <span style="margin-right: 0px; margin-left: 0px" class="n">queryset</span><span style="margin-right: 0px; margin-left: 0px" class="p">):</span>
        <span style="margin-right: 0px; margin-left: 0px" class="n">queryset</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">update</span><span style="margin-right: 0px; margin-left: 0px" class="p">(</span><span style="margin-right: 0px; margin-left: 0px" class="n">status</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b><span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">'p'</font></span><span style="margin-right: 0px; margin-left: 0px" class="p">)</span>
    <span style="margin-right: 0px; margin-left: 0px" class="n">make_published</span><b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">.</span></b><span style="margin-right: 0px; margin-left: 0px" class="n">short_description</span> <b><span style="margin-right: 0px; margin-left: 0px; font-weight: bold" class="o">=</span></b> <span style="margin-right: 0px; color: rgb(187, 136, 68); margin-left: 0px" class="s"><font color="rgb(187, 136, 68)">&quot;Mark selected stories as published</font></span></pre>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351378497776" FOLDED="true" ID="ID_1578801846" MODIFIED="1351378823287" TEXT="Alternativa QSet">
<node CREATED="1351378761166" ID="ID_125963443" MODIFIED="1351378820419" TEXT="Pueden hacerse a nivle de&#xa0; QSet&#xa;&gt;&gt;&gt;  queryset.update(status=&apos;p&apos;) &#xa;&#xa;o trabajarse objeto por objeto &#xa;&gt;&gt;&gt; for&#xa0;obj&#xa0;in&#xa0;queryset:&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;do_something_with(obj)"/>
</node>
</node>
<node CREATED="1351378883370" FOLDED="true" ID="ID_570785342" MODIFIED="1351873720992" TEXT="Parametros ">
<node CREATED="1351378890161" ID="ID_1658054790" MODIFIED="1351378926661" TEXT="message_user ">
<node CREATED="1351378927231" ID="ID_819352864" MODIFIED="1351378937661" TEXT="request,  message "/>
</node>
<node CREATED="1351378940720" ID="ID_276976323" MODIFIED="1351378957358" TEXT="short_description"/>
</node>
</node>
<node CREATED="1351377176048" FOLDED="true" ID="ID_291441057" MODIFIED="1351873725629" POSITION="right" TEXT="FrontEnd">
<node CREATED="1351377331041" ID="ID_1693043076" MODIFIED="1351377346299">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Nuevo boton de acciones, y un combo
    </p>
    <p>
      Modelo de seleccion por checkbox,
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1351377393417" FOLDED="true" ID="ID_787496984" MODIFIED="1351872685118">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Acciones genericas&#160;
    </p>
    <p>
      App scope
    </p>
  </body>
</html></richcontent>
<node CREATED="1351377430718" ID="ID_296165696" MODIFIED="1351377747651">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Las aacciones como por ejemplo borrar registros o exportar se definiran de todas maneras a nivel de la vista,&#160;&#160;se podrian definir en alguna parte el grupo de acciones posibles,&#160;&#160;en la misma tabla de definicion cargar __actions y una lista de valores posible definidos.
    </p>
    <p>
      
    </p>
    <p>
      Las acciones genericas son de dos tipos,
    </p>
    <ol>
      <li>
        acciones definidas a nivel de app q no tienen nada q ver con el registro activo
      </li>
      <li>
        acciones genericas en funcion de los registros activos
      </li>
    </ol>
    <p>
      En el primer caso se definira un combo en la barra de estado q permita seleccionar lo q se desea,
    </p>
    <p>
      en el segundo caso siempre seran agregadas como parte de la PCI,
    </p>
    <p>
      
    </p>
  </body>
</html></richcontent>
</node>
</node>
</node>
<node CREATED="1351862797002" FOLDED="true" ID="ID_1114327862" MODIFIED="1351958169217" POSITION="left" TEXT="TODO">
<node CREATED="1351862845970" ID="ID_1594373119" MODIFIED="1351862873720" TEXT="Cambiar la conf para agregar un compo o un boton ( combo ) de acciones,  "/>
<node CREATED="1351883592109" ID="ID_1174908951" MODIFIED="1351883667343">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      En detalles cambiar la llave q en este momento es menuText por name, dejar el menuText como opcional,&#160;&#160;esto para poder referenciar los detalles de impresion de manera estandar por &quot;name&quot;
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351862809689" FOLDED="true" ID="ID_1516347322" MODIFIED="1351872561837" POSITION="left" TEXT="Journal">
<node CREATED="1351862822627" ID="ID_1709910413" MODIFIED="1351862845305" TEXT="Permitir seleccion en la grilla"/>
</node>
<node CREATED="1351880609601" FOLDED="true" ID="ID_579351201" MODIFIED="1351884133175" POSITION="right" TEXT="Esquema Actions">
<node CREATED="1351880624407" ID="ID_144128726" MODIFIED="1351880630546" TEXT="name"/>
<node CREATED="1351880630816" ID="ID_1272139468" MODIFIED="1351880634484" TEXT="type"/>
<node CREATED="1351880634959" ID="ID_162770318" MODIFIED="1351880641214" TEXT="refreshOnCompete"/>
<node CREATED="1351880642103" ID="ID_548055976" MODIFIED="1351882910675" TEXT="[]Parameters">
<node CREATED="1351880665143" ID="ID_1737565726" MODIFIED="1351880672079" TEXT="name"/>
<node CREATED="1351880672367" ID="ID_1114539387" MODIFIED="1351880677662" TEXT="title"/>
<node CREATED="1351880678437" ID="ID_269004036" MODIFIED="1351880681661" TEXT="protoIcon"/>
<node CREATED="1351880681938" ID="ID_1768778813" MODIFIED="1351880688832" TEXT="description"/>
<node CREATED="1351880690499" ID="ID_609093593" MODIFIED="1351880695199" TEXT="vrDefault"/>
<node CREATED="1351880695886" ID="ID_1134557341" MODIFIED="1351880705871" TEXT="[]choices"/>
<node CREATED="1351880707652" ID="ID_810694946" MODIFIED="1351880709958" TEXT="type"/>
<node CREATED="1351880712700" ID="ID_259600992" MODIFIED="1351884127329" TEXT="required"/>
</node>
</node>
<node CREATED="1351879518496" ID="ID_358869822" MODIFIED="1351882842309" POSITION="right" TEXT="Reportes">
<node CREATED="1351882870827" FOLDED="true" ID="ID_1744639704" MODIFIED="1351884134674" TEXT="Como hacerlo">
<node CREATED="1351379570158" FOLDED="true" ID="ID_1877307174" MODIFIED="1351884128781" TEXT="Generalidades">
<node CREATED="1351379597839" ID="ID_1672805558" MODIFIED="1351379675122">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Hay dos maneras de generar los reportes:
    </p>
    <p>
      
    </p>
    <ol>
      <li>
        Haciendo un recorrido de los everyRow y en los rompimientos por llaves,&#160;&#160;traer los datos de los encabezados, esto es lo mejor repotes analiticos, es la manera como lo hace IssReportes,&#160;
      </li>
      <li>
        Cargando un encabezado con una plantilla y luego recorriendo los detalles asociados cada uno con su respectiva plantilla, todos deben residir en el encabezado. como un reporte definido, es la manera como lo hace IssReporteLibre.
      </li>
    </ol>
    <p>
      ReporteLibre
    </p>
    <p>
      
    </p>
    <p>
      &#160;&#160;&#160;&#160;Este reporte se genera a partir de un registro especifico, no hay criterios libres (qbe) de generacion.
    </p>
    <p>
      &#160;&#160;&#160;&#160;Definir una estructura json para manejarlo, cada vista tendra una lista de reportes
    </p>
    <p>
      
    </p>
    <p>
      &#160;&#160;&#160;&#160;Cada reporte tendra
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Nombre
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Icono en la ventana de reportes
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Lista de variables usadas ( properties )
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;plantilla de base
    </p>
    <p>
      
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;* Despues de leer el encabezado se leen los detalles correspondientes en una o varias plantillas,
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;* los detalles se sucederan en orden,
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;plantilla detalle&#160;&#160;( items [])
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;ConceptoBase
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Pantilla
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;&#160;Properties
    </p>
    <p>
      
    </p>
    <p>
      
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351379562906" ID="ID_1133551658" MODIFIED="1351882850966" TEXT="Report as actions">
<node CREATED="1351879548322" ID="ID_1765752268" MODIFIED="1351880555762">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Los reportes son un tipo particular de action, identificada por el tipo,&#160;
    </p>
    <p>
      Se usara la misma logica de las sheets,&#160;&#160;se leen los registros, y se cargan las plantillas reemplazando las variables y luego generando el html correspondiente
    </p>
    <p>
      
    </p>
    <p>
      La definicion del reporte,&#160;&#160;buscara si los detalles estan habilidados para ser impresos.&#160;&#160;incluso podran ser manejados por tipo de registro.
    </p>
    <p>
      
    </p>
    <p>
      el reporte ( sheetName ) puede venir como un parametro de la accion
    </p>
    <ol>
      <li>
        se lee el registro de base para selecciona un reporte ( sheet )&#160;&#160;en caso q no venga el sheetName,
      </li>
      <li>
        se reemplanzan las variables,
      </li>
      <li>
        se buscan los detalles habilidatos, con un sheetName opcional para cada uno.
      </li>
    </ol>
  </body>
</html></richcontent>
</node>
</node>
</node>
<node CREATED="1351880741586" ID="ID_209336724" MODIFIED="1351961076129">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Esquema protoSheets
    </p>
  </body>
</html>
</richcontent>
<node CREATED="1351880764467" ID="ID_1278235206" MODIFIED="1351880846761" TEXT="name"/>
<node CREATED="1351880853727" ID="ID_1404798510" MODIFIED="1351880856867" TEXT="title"/>
<node CREATED="1351880857272" FOLDED="true" ID="ID_149569749" MODIFIED="1351960432813" TEXT="template">
<node CREATED="1351880913687" ID="ID_243112394" MODIFIED="1351881110038">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      El template es uno solo, si se quieren garantizar saltos de pagina, se tendra una directiva especial <b>&lt;pageBreak&gt; </b>q permitira enviar alguna directiva para el salto de pagina
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1351881869260" FOLDED="true" ID="ID_838362884" MODIFIED="1351882294886" TEXT="PageBreaks">
<node CREATED="1351881874676" FOLDED="true" ID="ID_396516563" MODIFIED="1351882224359" TEXT="estrategias">
<node CREATED="1351881882955" ID="ID_846796663" MODIFIED="1351882062907">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      <a http-equiv="content-type" content="text/html; charset=utf-8" href="http://www.cybertext.com.au/tips_HTML_pagebreak.htm">http://www.cybertext.com.au/tips_HTML_pagebreak.htm</a>
    </p>
    <p>
      
    </p>
    <p>
      There are several strategies you can use to insert page breaks within an HTML document, thus ensuring that the printed document does not break over lines, graphics, etc. There are limitations, however, and these are listed below.
    </p>
    <p>
      
    </p>
    <p>
      Limitations
    </p>
    <p>
      
    </p>
    <p>
      The page-break styles work with the following block elements: BLOCKQUOTE, BODY, CENTER, DD, DIR, DIV, DL, DT, FIELDSET, FORM, Hn, LI, LISTING, MARQUEE, MENU, OL, P, PLAINTEXT, PRE, UL, XMP.
    </p>
    <p>
      Only applicable to Cascading Style Sheets 2 specification
    </p>
    <p>
      Only applicable to Internet Explorer 4.x and later at this stage - adding page breaks will not cause any ill effects on other browsers.
    </p>
    <p>
      Do NOT try and use within a table - they won't work! See Strategy 6 (below) for breaking a table when printing.
    </p>
    <p>
      
    </p>
    <p>
      <b>Strategy 1</b>
    </p>
    <p>
      
    </p>
    <p>
      &lt;style&gt;
    </p>
    <p>
      .break { page-break-before: always; }
    </p>
    <p>
      &lt;/style&gt;
    </p>
    <p>
      &lt;body&gt;
    </p>
    <p>
      content on page 1...
    </p>
    <p>
      &lt;h1 class=&quot;break&quot;&gt;text of Heading 1 on page 2&lt;/h1&gt;
    </p>
    <p>
      content on page 2...
    </p>
    <p>
      &lt;h1 class=&quot;break&quot;&gt;text of Heading 1 on page 3&lt;/h1&gt;
    </p>
    <p>
      content on page 3...
    </p>
    <p>
      &lt;p class=&quot;break&quot;&gt;content on top of page 4&lt;/p&gt;
    </p>
    <p>
      content on page 4...
    </p>
    <p>
      &lt;/body&gt;
    </p>
    <p>
      Notes about Strategy 1
    </p>
    <p>
      
    </p>
    <p>
      This example can be part of an external (CSS) or internal style.
    </p>
    <p>
      
    </p>
    <p>
      Using a class such as .break and not prefacing it with any form of formatting, means that you can add the information wherever you want a page break to occur - including the middle of the text.
    </p>
    <p>
      
    </p>
    <p>
      Examples:
    </p>
    <p>
      
    </p>
    <p>
      If you want the page break to occur before each heading 1, you'd add &lt;h1 class=&quot;break&quot;&gt; instead of &lt;h1&gt;. Note that the first &lt;h1&gt;, likely to be on the first page, should probably remain as &lt;h1&gt; and only subsequent &lt;h1&gt;'s need the class attribute.
    </p>
    <p>
      If you want to insert a page break part way through the text, then insert &lt;p class= &quot;break&quot;&gt;instead of the standard &lt;p&gt; for the text you want to be printed on a new page.
    </p>
    <p>
      
    </p>
    <p>
      <b>Strategy 2</b>
    </p>
    <p>
      
    </p>
    <p>
      &lt;style&gt;
    </p>
    <p>
      h6 {page-break-before: always;}
    </p>
    <p>
      &lt;/style&gt;
    </p>
    <p>
      Notes about Strategy 2
    </p>
    <p>
      
    </p>
    <p>
      The reason I used H6 here is that it is a little-used heading for most web pages. By emulating a H1 in font, font size, etc., then adding this code to H6 in addition to the page break information, you can substitute H6 for H1 wherever you want a page break to occur. You can still keep H1 for sections where you don't want to force a page break. Naturally if you want to force a page break at EVERY H1, then you would include the page break information within the H1 style. This strategy can be used with both CSS and internal styles.
    </p>
    <p>
      
    </p>
    <p>
      <b>Strategy 3</b>
    </p>
    <p>
      
    </p>
    <p>
      &lt;div style=&quot;page-break-before: always&quot;&gt;blah blah&lt;/div&gt;
    </p>
    <p>
      Notes about Strategy 3
    </p>
    <p>
      
    </p>
    <p>
      Make sure you include some text between the &lt;div&gt; opening and closing tags, otherwise this may not work.
    </p>
    <p>
      
    </p>
    <p>
      <b>Strategy 4</b>
    </p>
    <p>
      
    </p>
    <p>
      &lt;p style=&quot;page-break-before: always&quot;&gt;blah blah&lt;/p&gt;
    </p>
    <p>
      Strategy 5
    </p>
    <p>
      
    </p>
    <p>
      &lt;style&gt;
    </p>
    <p>
      p.page { page-break-after: always; }
    </p>
    <p>
      &lt;/style&gt;
    </p>
    <p>
      &lt;body&gt;
    </p>
    <p>
      content on page 1
    </p>
    <p>
      &lt;p class=&quot;page&quot;&gt;&lt;/p&gt;
    </p>
    <p>
      content on page 2
    </p>
    <p>
      &lt;/body&gt;
    </p>
    <p>
      Notes about Strategy 5
    </p>
    <p>
      
    </p>
    <p>
      This example can be part of an external (CSS) or internal style.
    </p>
    <p>
      
    </p>
    <p>
      <b>Strategy 6</b>
    </p>
    <p>
      
    </p>
    <p>
      ......
    </p>
    <p>
      &lt;/tr&gt;
    </p>
    <p>
      &lt;/table&gt;
    </p>
    <p>
      &lt;/center&gt;
    </p>
    <p>
      &lt;/div&gt;
    </p>
    <p>
      
    </p>
    <p>
      &lt;p class=&quot;break&quot;&gt;&lt;!--Appendix 2 (continued)--&gt;&lt;/p&gt;
    </p>
    <p>
      
    </p>
    <p>
      &lt;div align=&quot;center&quot;&gt;&lt;center&gt;
    </p>
    <p>
      [start next table here...]
    </p>
    <p>
      Notes about Strategy 6
    </p>
    <p>
      
    </p>
    <p>
      Tables need to be broken in order to force a page break.
    </p>
    <p>
      
    </p>
    <p>
      In the code in this example, the table has been &quot;chopped&quot; where the break is to occur, a &lt;p&gt; tag inserted with the class attribute added, then the table restarted.
    </p>
    <p>
      
    </p>
    <p>
      A comment has also been added to alert anybody dealing with the code at a later date that the table is continued.
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351882225682" FOLDED="true" ID="ID_1490482923" MODIFIED="1351882241383" TEXT="css">
<node CREATED="1351882229688" ID="ID_400880004" MODIFIED="1351882234996">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      http://www.htmlgoodies.com/beyond/css/article.php/3470341/CSS-and-Printing.htm
    </p>
    <p>
      
    </p>
    <p>
      Page Break
    </p>
    <p>
      
    </p>
    <p>
      There are two commands you're worried about here:
    </p>
    <p>
      page-break-after
    </p>
    <p>
      page-break-before
    </p>
    <p>
      
    </p>
    <p>
      You can pretty much pick out what each does. The first sets the printing page break just before the element, the second sets the page break just after.
    </p>
    <p>
      Each command has, in theory anyway, four attributes:
    </p>
    <p>
      
    </p>
    <p>
      always | auto | left | right
    </p>
    <p>
      
    </p>
    <p>
      always tells the browser to break the print page after this element always.
    </p>
    <p>
      auto is the default. You're telling the browser to do what it would do anyway: Page break where the page ends.
    </p>
    <p>
      left is not supported by any browser yet. It is used if your printer will print both sides of a page, like a manuscript. If the page is a left-facing page, use this attribute.
    </p>
    <p>
      right is what you use if it's a right-facing page.
    </p>
    <p>
      
    </p>
    <p>
      The Format
    </p>
    <p>
      
    </p>
    <p>
      Here's what it looks like in your page's &lt;HEAD&gt; tags:
    </p>
    <p>
      &lt;STYLE TYPE=&quot;text/css&quot;&gt;
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;H2 {page-break-before: always}
    </p>
    <p>
      &lt;/STYLE&gt;
    </p>
    <p>
      
    </p>
    <p>
      That format will produce a print page break before each H2 on the page. Would you like to try it out? This page has four H2 headings. Go ahead and print the page. Each H2 will use a new page and will act as the Header for the printed page. Remember, though, that you have to be using Internet Explorer 4 or better.
    </p>
    <p>
      Setting A Specific Page Break
    </p>
    <p>
      
    </p>
    <p>
      Maybe it's better not to have every H2 break the page. Maybe you'd like a page break at a specific point to keep a particular look. You do that by setting up a class of page breaks.
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;You can set up the class on any HTML command, but I think the best method is to set up the class within a &lt;BR&gt; or &lt;P&gt; command. That way there's some white space where the page can break. Here's a look at the format (this will sit between your &lt;HEAD&gt; tags):
    </p>
    <p>
      &lt;STYLE TYPE=&quot;text/css&quot;&gt;
    </p>
    <p>
      &#160;&#160;&#160;&#160;&#160;P.breakhere {page-break-before: always}
    </p>
    <p>
      &lt;/STYLE&gt;
    </p>
    <p>
      
    </p>
    <p>
      This then will be the activator for the page break:
    </p>
    <p>
      &lt;P CLASS=&quot;breakhere&quot;&gt;
    </p>
    <p>
      You can set up as many different classes as you'd like as long as you keep following the same format as above.
    </p>
    <p>
      And That's That...
    </p>
    <p>
      
    </p>
    <p>
      This is another one of those commands that I would use if there's a need for it, regardless of the type of browser the viewer is running. Those that understand the command get the effect, and those that don't just get a straight page print. Either way, the user gets a nice print of the page. It's just that in one of the prints, you're able to set a few parameters.
    </p>
  </body>
</html></richcontent>
</node>
</node>
</node>
<node CREATED="1351882430042" FOLDED="true" ID="ID_1878056467" MODIFIED="1351882444051" TEXT="html5">
<node CREATED="1351882433800" ID="ID_1109411776" MODIFIED="1351882437990" TEXT="&lt;header&gt;"/>
<node CREATED="1351882438649" ID="ID_748009331" MODIFIED="1351882442386" TEXT="&lt;footer&gt;"/>
</node>
</node>
<node CREATED="1351882315271" FOLDED="true" ID="ID_513311880" MODIFIED="1351960429954" TEXT="sheetType">
<node CREATED="1351882398482" ID="ID_1322136082" MODIFIED="1351882470553" TEXT="Si la definicion de la pagina es apta para imprimir o para pantalla "/>
<node CREATED="1351882603472" ID="ID_1652399136" MODIFIED="1351960181629" TEXT="Choices">
<node CREATED="1351882345185" ID="ID_553700079" MODIFIED="1351882354477" TEXT="printer"/>
<node CREATED="1351882354784" ID="ID_1855489421" MODIFIED="1351882376267" TEXT="grid"/>
<node CREATED="1351882376871" ID="ID_1262342619" MODIFIED="1351882388029" TEXT="all"/>
</node>
</node>
<node CREATED="1351883190448" ID="ID_1237735294" MODIFIED="1351883939698" TEXT="[] sheetDetails">
<node CREATED="1351883209692" ID="ID_301612944" MODIFIED="1351883416780">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      El reporte podra leer las plantillas de los detalles declarados,&#160;
    </p>
    <p>
      
    </p>
    <p>
      |ncluso los detalles podrian ser recursivos ( en la declaracion, no en la ejecucion ),&#160;&#160;cada detalle podria tener a su vez detalles, el arbol de reporte es el q se define en el nivel mayor, para poder evitar problemas posteriores,
    </p>
  </body>
</html></richcontent>
</node>
<node CREATED="1351883435782" ID="ID_1158674451" MODIFIED="1351883487946" TEXT="propiedades">
<node CREATED="1351883489138" ID="ID_221459070" MODIFIED="1351960814427" TEXT="detailView">
<node CREATED="1351883493945" ID="ID_464928993" MODIFIED="1351883765047">
<richcontent TYPE="NODE"><html>
  <head>
    
  </head>
  <body>
    <p>
      Corresponde al menu text del detalle, las llaves seran las declaradas en el detalle,
    </p>
  </body>
</html></richcontent>
</node>
</node>
<node CREATED="1351885639825" ID="ID_1025531249" MODIFIED="1351885646291" TEXT="template">
<node CREATED="1351885648310" ID="ID_1353614969" MODIFIED="1351885678635" TEXT="Los templates son particulares al reporte"/>
<node CREATED="1351885783305" ID="ID_1784040056" MODIFIED="1351886191757" TEXT="Las propeties si hay q leerlas del detalle, por q seria muy problematico definirlas al nivel del registro padre. &#xa;&#xa;Se leen las propiedades de &quot;sheetProps&quot; si no estan definidas se leen los fields,"/>
</node>
<node CREATED="1351883718784" ID="ID_265741231" MODIFIED="1351883946846" TEXT="[] sheetDetails ...."/>
<node CREATED="1351885681612" ID="ID_1830588075" MODIFIED="1351885684793" TEXT="obsoletas">
<node CREATED="1351883768009" ID="ID_1177831951" MODIFIED="1351883790436" TEXT="sheetName ">
<node CREATED="1351883793680" ID="ID_415667130" MODIFIED="1351883818126" TEXT="Se puede seleccionar una hoja especifica de cada detalle "/>
<node CREATED="1351885692731" ID="ID_1603062305" MODIFIED="1351885734443" TEXT="NO,  si se manejan los template en el reporte, se usa el detalle solo para la conexion"/>
</node>
</node>
</node>
</node>
</node>
</node>
</node>
</map>
