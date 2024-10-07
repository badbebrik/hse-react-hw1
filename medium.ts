export type DeepPartial<T> = T extends Function
  ? T // Функции не трогаем
  : T extends object // Обрабатываем только объекты и массивы
  ? T extends Array<infer U> // Если  массив, рекурсивно применяем DeepPartial к элементам
    ? Array<DeepPartial<U>>
    : { [P in keyof T]?: DeepPartial<T[P]> } // Делаем ключи объектов опциональными
  : T; // Примитивные типы не трогаем

export type MyCapitalize<T extends string> =
  T extends `${infer FirstLetter}${infer RestContent}` // Бьем строку на первую букву и остальную часть
    ? `${Uppercase<FirstLetter>}${RestContent}` // Переводим первую букву в верхний регистр, остальное оставляем
    : T; // Если строка пустая или не подходит, возвращаем её без изменений

export type DeepMutable<T> = T extends object
  ? T extends Function // Функции не трогаем
    ? T
    : T extends Array<infer U> // Если массив, рекурсивно идем по элементам и применяем DeepMutable
    ? Array<DeepMutable<U>>
    : {
        -readonly [P in keyof T]: DeepMutable<T[P]>; // Убираем readonly, применяем рекурсивно DeepMutable к ключам
      }
  : T; // Примитивные типы не трогаем

export type ParseURLParams<StringElem extends string> =
  StringElem extends `${infer BeforeParam}:${infer ParamName}/${infer RestOfURL}` // Ищем параметр в формате ':param', продолжаем разбор после '/'
    ? ParamName | ParseURLParams<RestOfURL> // Находим параметр и продолжаем искать дальше в оставшейся строке
    : StringElem extends `${infer BeforeParam}:${infer ParamName}`
    ? ParamName // Если это последний параметр (нет больше / в строке), возвращаем его
    : never; // Если нет параметров - never

interface PhoneSpecs {
  model: string;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  contacts: {
    name: string;
    phoneNumber: string;
  }[];
}

type PartialPhone = DeepPartial<PhoneSpecs>;

// Проверка DeepPartial: должен вернуться тип со всеми опциональными полями
type TestDeepPartial = PartialPhone extends {
  model?: string;
  dimensions?: {
    length?: number;
    width?: number;
    thickness?: number;
  };
  contacts?: {
    name?: string;
    phoneNumber?: string;
  }[];
}
  ? true
  : false;

// Проверки MyCapitalize на разных кейсах
type SingleLetter = MyCapitalize<"a">;
type TestSingleLetter = SingleLetter extends "A" ? true : false;

type EmptyString = MyCapitalize<"">;
type TestEmptyString = EmptyString extends "" ? true : false;

type AlreadyCapitalized = MyCapitalize<"BUKVA">;
type TestAlreadyCapitalized = AlreadyCapitalized extends "BUKVA" ? true : false;

type MultipleWords = MyCapitalize<"bukva bukva bukva">;
type TestMultipleWords = MultipleWords extends "Bukva bukva bukva" ? true : false;

interface PhoneSpecsWithReadonly {
  readonly model: string;
  readonly dimensions: {
    readonly length: number;
    readonly width: number;
    readonly thickness: number;
  };
  readonly contacts: readonly {
    readonly name: string;
    readonly phoneNumber: string;
  }[];
}

type MutablePhone = DeepMutable<PhoneSpecsWithReadonly>;

// Проверка DeepMutable: должен вернуться тип с всеми полями без readonly
type TestDeepMutable = MutablePhone extends {
  model: string;
  dimensions: {
    length: number;
    width: number;
    thickness: number;
  };
  contacts: {
    name: string;
    phoneNumber: string;
  }[];
}
  ? true
  : false;

// Тесты для ParseURLParams
type Params = ParseURLParams<"/phone/:id/:model/:year">;
type TestParseURLParams = Params extends "id" | "model" | "year" ? true : false;

type SingleParam = ParseURLParams<"/phone/:model">;
type TestSingleParam = SingleParam extends "model" ? true : false;

type NoParams = ParseURLParams<"/phone/model">;
type TestNoParams = NoParams extends never ? true : false;

type MultipleParams = ParseURLParams<"/phone/:model/:year/:color">;
type TestMultipleParams = MultipleParams extends "model" | "year" | "color"
  ? true
  : false;

type ComplexURL = ParseURLParams<"/api/v1/phone/:id/specs/:version">;
type TestComplexURL = ComplexURL extends "id" | "version" ? true : false;
