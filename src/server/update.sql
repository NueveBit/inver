/* R3 */
create table Seguidor (
    id smallint not null auto_increment,
    idSolicitudInformacion bigint(20) not null,
    idUsuario bigint(20) not null,
    propietario boolean not null,
    fecha date null,
    
    constraint fk_Seguidor_idSolicitudInformacion foreign key (idSolicitudInformacion)
        references SolicitudInformacion(id)
        ON DELETE CASCADE,
    constraint fk_Seguidor_idUsuario foreign key (idUsuario)
        references Usuario(id)
        ON DELETE CASCADE,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

alter table SolicitudInformacion DROP FOREIGN KEY fk_SolicitudInformacion_idUsuario;
alter table SolicitudInformacion drop idUsuario;

insert into Seguidor (idSolicitudInformacion, idUsuario, propietario, fecha) values (1, 1, 1, '2014-08-14');
insert into Seguidor (idSolicitudInformacion, idUsuario, propietario, fecha) values (2, 1, 1, '2014-08-14');
insert into Seguidor (idSolicitudInformacion, idUsuario, propietario, fecha) values (7, 1, 1, '2014-08-14');

/* R2 
create table TipoSolicitud (
    id smallint not null auto_increment,
    nombre varchar(255) not null,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

alter table SolicitudInformacion add tipoId smallint not null;
alter table SolicitudInformacion add constraint fk_SolicitudInformacion_tipoId foreign key (tipoId) references TipoSolicitud(id) on delete cascasde;

insert into TipoSolicitud (id, nombre) values (NULL, "Información pública"); 
insert into TipoSolicitud (id, nombre) values (NULL, "Datos personales"); 
insert into TipoSolicitud (id, nombre) values (NULL, "Corrección de datos personales"); 
*/
/* R1
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
*/
