-- delete from rai_domaineaffaires;

delete from rai_indexdesdonnees;
delete from rai_specifications;
delete from rai_projet;
delete from rai_regroupementdesmodeles;
delete from rai_entite;
delete from rai_reglesgestion;
delete from rai_elementdonnee;
delete from rai_porteereglegestion;
delete from rai_raccordement;
delete from rai_modeleraccordement;
delete from rai_relation;
delete from rai_modele;
delete from rai_norme;
delete from rai_typeregle;
delete from rai_codagenormalise;


alter table rai_relation add column dependance bool;
