create table TipoSujeto (
    id int(11) not null auto_increment,
    nombre varchar(255) not null,

    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

create table SujetoObligado (
    id bigint(20) not null auto_increment,
    nombre varchar(255) not null,
    portalWeb varchar(255) null,
    idTipoSujeto int(11) not null,

    constraint fk_SujetoObligado_idTipoSujeto foreign key (idTipoSujeto)
        references TipoSujeto(id)
        ON DELETE CASCADE,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

create table Indicador (
    id bigint(20) not null auto_increment,
    nombre varchar(10) not null,
    valor double not null,
    observaciones blob null,
    fechaSupervision date null,
    idSujetoObligado bigint(20) not null,
    tipoId smallint not null,

    constraint fk_Indicador_idSujetoObligado foreign key (idSujetoObligado)
        references SujetoObligado(id)
        ON DELETE CASCADE,
    constraint fk_Indicador_tipoId foreign key (tipoId)
        references TipoIndicador(id)
        ON DELETE CASCADE,

    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

create table SolicitudRecibida (
    id bigint(20) not null auto_increment,
    medio varchar(255) not null,
    fecha date not null,
    idSujetoObligado bigint(20) not null,

    constraint fk_SolicitudRecibida_idSujetoObligado foreign key (idSujetoObligado)
        references SujetoObligado(id)
        ON DELETE CASCADE,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

create table Usuario(
    id bigint(20) auto_increment,
    username varchar(255) not null,
    password varchar(255) not null,
    preguntaSecreta varchar(255) not null,
    respuestaSecreta varchar(255) not null,
    personalidadJuridica varchar(255) not null,
    nombre varchar(255) not null,
    apellidoPaterno varchar(255) not null,
    apellidoMaterno varchar(255) not null,
    fechaNacimiento date null,
    email varchar(255) not null,
    estado varchar(255) not null,
    municipio varchar(255) not null,
    codigoPostal varchar(255) not null,
    colonia varchar(255) not null,
    calle varchar(255) not null,
    numeroExterior varchar(255) not null,
    numeroInterior varchar(255) null,
    telefono varchar(20) null,
    fax varchar(20) null,

    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

create table SolicitudInformacion(
    id bigint(20) not null auto_increment,
    tipo varchar (255) not null,
    tipoGestion varchar (255) null,
    descripcion blob not null,
    status varchar(255) not null,
    formaNotificacion varchar(255) not null,
    fechaInicio date not null,
    fechaNotificacion date null,
    fechaLimite date not null,
    idSujetoObligado bigint(20) not null,
    idUsuario bigint(20) not null,

    constraint fk_SolicitudInformacion_idSujetoObligado foreign key (idSujetoObligado)
        references SujetoObligado(id)
        ON DELETE CASCADE,
    constraint fk_SolicitudInformacion_idUsuario foreign key (idUsuario)
        references Usuario(id)
        ON DELETE CASCADE,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

create table RecursoRevision(
    id bigint(20) not null,
    actoRecurrido blob not null,
    idSolicitudInformacion bigint(20) not null,

    constraint fk_RecursoRevision_idSolicitudInformacion foreign key (idSolicitudInformacion)
        references SolicitudInformacion(id)
        ON DELETE CASCADE,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;

create table TipoIndicador (
    id smallint not null,
    nombre varchar(255) not null,
    primary key(id)
) engine=INNODB collate utf8_unicode_ci;