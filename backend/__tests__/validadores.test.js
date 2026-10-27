const {
  validarRegistro,
  validarLogin,
  validarVuelo,
  validarPasajero,
  validarTripulacion,
} = require("../utils/validadores");

// Crea un res falso: status() devuelve el mismo objeto para poder encadenar .json()
const crearRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const registroValido = {
  nombre: "Laura Sofia",
  primer_apellido: "Sanchez",
  segundo_apellido: "Reyes",
  correo: "laura123@gmail.com",
  password: "abc123",
  telefono: "4941161315",
  num_pasaporte: "MX12345",
  genero: "femenino",
};

describe("validarRegistro", () => {
  test("con datos validos llama a next()", () => {
    const req = { body: { ...registroValido } };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  test("con el cuerpo vacio responde 400 y lista los campos obligatorios", () => {
    const req = { body: {} };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    const { errores } = res.json.mock.calls[0][0];
    expect(errores).toEqual(
      expect.arrayContaining([
        "El nombre es obligatorio.",
        "El primer apellido es obligatorio.",
        "El correo es obligatorio.",
      ]),
    );
  });

  test("rechaza un correo con formato invalido", () => {
    const req = { body: { ...registroValido, correo: "correo-sin-arroba" } };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("rechaza un telefono que no tiene 10 digitos", () => {
    const req = { body: { ...registroValido, telefono: "123456789" } };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("rechaza un pasaporte con letras minusculas", () => {
    const req = { body: { ...registroValido, num_pasaporte: "mx12345" } };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("rechaza una contrasena menor a 6 caracteres", () => {
    const req = { body: { ...registroValido, password: "123" } };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("rechaza un genero distinto de masculino o femenino", () => {
    const req = { body: { ...registroValido, genero: "otro" } };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("rechaza un nombre que empieza con minuscula", () => {
    const req = { body: { ...registroValido, nombre: "laura" } };
    const res = crearRes();
    const next = jest.fn();

    validarRegistro(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("validarLogin", () => {
  test("con correo y contrasena validos llama a next()", () => {
    const req = { body: { correo: "laura123@gmail.com", password: "abc123" } };
    const res = crearRes();
    const next = jest.fn();

    validarLogin(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("sin contrasena responde 400", () => {
    const req = { body: { correo: "laura123@gmail.com" } };
    const res = crearRes();
    const next = jest.fn();

    validarLogin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("con correo invalido responde 400", () => {
    const req = { body: { correo: "no-es-correo", password: "abc123" } };
    const res = crearRes();
    const next = jest.fn();

    validarLogin(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("validarVuelo", () => {
  test("con todos los campos llama a next()", () => {
    const req = {
      body: {
        codigo_vuelo: "QZ100",
        fecha_salida: "2026-11-01 10:00",
        fecha_llegada: "2026-11-01 12:00",
        id_ruta: 1,
        id_avion: 2,
      },
    };
    const res = crearRes();
    const next = jest.fn();

    validarVuelo(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("con el cuerpo vacio responde 400 con 5 errores", () => {
    const req = { body: {} };
    const res = crearRes();
    const next = jest.fn();

    validarVuelo(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json.mock.calls[0][0].errores).toHaveLength(5);
  });
});

describe("validarPasajero", () => {
  const pasajeroValido = {
    nombre: "Juan Carlos",
    primer_apellido: "Lopez",
    correo: "juan@gmail.com",
    telefono: "4941161315",
    num_pasaporte: "MX123456",
  };

  test("con datos validos llama a next()", () => {
    const req = { body: { ...pasajeroValido } };
    const res = crearRes();
    const next = jest.fn();

    validarPasajero(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("con pasaporte invalido responde 400", () => {
    const req = { body: { ...pasajeroValido, num_pasaporte: "1234" } };
    const res = crearRes();
    const next = jest.fn();

    validarPasajero(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe("validarTripulacion", () => {
  test("con datos validos llama a next()", () => {
    const req = {
      body: {
        nombre: "Pedro Pablo",
        primer_apellido: "Garcia",
        nacionalidad: "Mexicana",
        rol: "Piloto",
      },
    };
    const res = crearRes();
    const next = jest.fn();

    validarTripulacion(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  test("sin rol responde 400", () => {
    const req = {
      body: {
        nombre: "Pedro Pablo",
        primer_apellido: "Garcia",
        nacionalidad: "Mexicana",
      },
    };
    const res = crearRes();
    const next = jest.fn();

    validarTripulacion(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});