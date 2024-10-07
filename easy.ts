export type MyPick<T, K extends keyof T> = {
  [P in K]: T[P]; // Проходимся по каждому ключу K и добавляем его в новый тип
};

export type NOfArray<ArrayObj extends any[], N extends number> = ArrayObj[N]; // Извлекаем тип N-го элемента массива

export type Unshift<ArrayType extends unknown[], Element> = [
  Element,
  ...ArrayType
]; // Создаем новый массив с Element первым, затем копируем остальные элементы из ArrayType

export type MyExclude<T, U> = T extends U ? never : T; // Если T подходит под тип U, исключаем его, иначе оставляем T

interface PhoneSpecs {
  model: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  batteryCapacity: number;
  contacts: {
    name: string;
    phoneNumber: string;
  }[];
}

// Проверка MyPick: должен вернуться тип { model: string, dimensions: { length: number, width: number, height: number } }
type PickedPhone = MyPick<PhoneSpecs, "model" | "dimensions">;
type TestMyPick = PickedPhone extends {
  model: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
}
  ? true
  : false;

type PhoneInfo = [string, number, boolean, { serialNumber: string }];

// Проверка NOfArray: должен вернуться тип второго элемента массива, в нашем случае number
type SecondElementType = NOfArray<PhoneInfo, 1>;
type TestNOfArray1 = SecondElementType extends number ? true : false;

type ContactsArray = [{ name: string; phoneNumber: string }];

// Проверка Unshift: должен вернуть массив с двумя элементами типа { name: string; phoneNumber: string }
type NewContact = Unshift<ContactsArray, { name: string; phoneNumber: string }>;
type TestUnshift = NewContact extends [
  { name: string; phoneNumber: string },
  { name: string; phoneNumber: string }
]
  ? true
  : false;

type PhoneFeatures = "WiFi" | "Bluetooth" | "GPS" | "NFC";

// Проверка MyExclude: должен вернуться тип 'WiFi' | 'Bluetooth' | 'NFC'
type ExcludeGPS = MyExclude<PhoneFeatures, "GPS">;
type TestMyExclude = ExcludeGPS extends "WiFi" | "Bluetooth" | "NFC"
  ? true
  : false;
