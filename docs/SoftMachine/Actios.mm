<map version="0.9.0">
<!-- To view this file, download free mind mapping software FreeMind from http://freemind.sourceforge.net -->
<node CREATED="1351377136644" ID="ID_1629252968" MODIFIED="1351377159506" TEXT="Actions">
<node CREATED="1351377169453" ID="ID_1266028467" MODIFIED="1351377174741" POSITION="right" TEXT="Django">
<node CREATED="1351377229419" ID="ID_1232764964" MODIFIED="1351379386201" TEXT="Como se definien">
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
</html>
</richcontent>
</node>
</node>
<node CREATED="1351377775037" ID="ID_768729252" MODIFIED="1351379299374" TEXT="Globales ( genericas ) ">
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
</html>
</richcontent>
</node>
</node>
<node CREATED="1351378231321" ID="ID_476293964" MODIFIED="1351378366099" TEXT="Ejemplos">
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
</html>
</richcontent>
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
</html>
</richcontent>
</node>
</node>
<node CREATED="1351378497776" FOLDED="true" ID="ID_1578801846" MODIFIED="1351378823287" TEXT="Alternativa QSet">
<node CREATED="1351378761166" ID="ID_125963443" MODIFIED="1351378820419" TEXT="Pueden hacerse a nivle de&#xa0; QSet&#xa;&gt;&gt;&gt;  queryset.update(status=&apos;p&apos;) &#xa;&#xa;o trabajarse objeto por objeto &#xa;&gt;&gt;&gt; for&#xa0;obj&#xa0;in&#xa0;queryset:&#xa0;&#xa0;&#xa0;&#xa0;&#xa0;do_something_with(obj)"/>
</node>
</node>
<node CREATED="1351378883370" ID="ID_570785342" MODIFIED="1351378888707" TEXT="Parametros ">
<node CREATED="1351378890161" ID="ID_1658054790" MODIFIED="1351378926661" TEXT="message_user ">
<node CREATED="1351378927231" ID="ID_819352864" MODIFIED="1351378937661" TEXT="request,  message "/>
</node>
<node CREATED="1351378940720" ID="ID_276976323" MODIFIED="1351378957358" TEXT="short_description"/>
</node>
</node>
<node CREATED="1351377176048" ID="ID_291441057" MODIFIED="1351379396667" POSITION="right" TEXT="FrontEnd">
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
</html>
</richcontent>
</node>
<node CREATED="1351377393417" ID="ID_787496984" MODIFIED="1351377429021" TEXT="Acciones genericas ">
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
</html>
</richcontent>
</node>
</node>
</node>
<node CREATED="1351377182225" ID="ID_1598938414" MODIFIED="1351379405106" POSITION="right" TEXT="FAQ">
<node CREATED="1351377961011" ID="ID_1506617092" MODIFIED="1351377966029" TEXT="Como implemetarlos">
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
</html>
</richcontent>
</node>
</node>
<node CREATED="1351378138640" ID="ID_16095163" MODIFIED="1351378144201" TEXT="Parametros adicionales">
<node CREATED="1351378163305" ID="ID_1638440659" MODIFIED="1351378166219" TEXT="puden pedir parametros adicionales, una ventana generica con la lista de los parametros, o una funcion q pueda leerlos de la forma o de la grilla. "/>
</node>
<node CREATED="1351378145016" ID="ID_1916533886" MODIFIED="1351378147791" TEXT="Retorno">
<node CREATED="1351378181828" ID="ID_1312855207" MODIFIED="1351378183919" TEXT="puede retornar un estado y/o refrescar la grilla."/>
</node>
</node>
</node>
</map>
