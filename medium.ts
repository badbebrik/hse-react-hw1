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
