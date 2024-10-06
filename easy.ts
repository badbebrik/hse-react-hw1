export type MyPick<T, K extends keyof T> = {
    [P in K]: T[P]; // Проходимся по каждому ключу K и добавляем его в новый тип
  };

export type NOfArray<ArrayObj extends any[], N extends number> = ArrayObj[N]; // Извлекаем тип N-го элемента массива

export type Unshift<ArrayType extends unknown[], Element> = [Element, ...ArrayType]; // Создаем новый массив с Element первым, затем копируем остальные элементы из ArrayType

export type MyExclude<T, U> = T extends U ? never : T; // Если T подходит под тип U, исключаем его, иначе оставляем T