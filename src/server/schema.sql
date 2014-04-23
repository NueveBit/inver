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

    constraint fk_Indicador_idSujetoObligado foreign key (idSujetoObligado)
        references SujetoObligado(id)
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
