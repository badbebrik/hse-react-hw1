type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}` // Соединяем первую часть и преобразованную вторую
  : S; // Если подчеркиваний не осталось, возвращаем строку

export type Camelize<ObjType> = ObjType extends Function
  ? ObjType // Функции не трогаем
  : ObjType extends Array<infer U> // Если массив, применяем Camelize к элементам массива
  ? Array<Camelize<U>>
  : ObjType extends object // Если объект - преобразовываем ключи
  ? {
      [K in keyof ObjType as SnakeToCamelCase<Extract<K, string>>]: Camelize<
        ObjType[K]
      >;
    }
  : // Преобразуем ключи объекта в camelCase и рекурсивно применяем Camelize ко всем значениям
    ObjType; // Примитивы не трогаем

export type DeepPick<
  T,
  Paths extends string
> = Paths extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? { [K in Key]: DeepPick<T[K], Rest> } // Рекурсивно выбираем вложенные ключи
    : never
  : Paths extends keyof T
  ? { [K in Paths]: T[K] } // Если путь не содержит вложенности (нет '.'), просто выбираем ключ
  : never;
