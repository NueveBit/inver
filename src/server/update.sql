create table TipoIndicador (
    id smallint not null auto_increment,
    nombre varchar(255) not null,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

alter table Indicador add tipoId smallint not null;

alter table Indicador add constraint fk_Indicador_tipoId foreign key (tipoId)
    references TipoIndicador(id)
    ON DELETE CASCADE;

insert into TipoIndicador (id, nombre) values (NULL, "ACCESO");
insert into TipoIndicador (id, nombre) values (NULL, "FINANCIERO");
insert into TipoIndicador (id, nombre) values (NULL, "FUNCIÓN ESPECÍFICA");
insert into TipoIndicador (id, nombre) values (NULL, "NORMATIVO");
insert into TipoIndicador (id, nombre) values (NULL, "ORGANIZACIONAL");
insert into TipoIndicador (id, nombre) values (NULL, "RESULTADOS");