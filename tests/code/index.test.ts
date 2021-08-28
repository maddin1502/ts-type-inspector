import { Dictionary } from 'ts-lib-extended';

describe('root', () => {
  test('exports', () => {
    expect(true).toBeDefined();
  });
});

type ObjectType = Record<PropertyKey, any>;

// class Anything {
//   public affe = 'hallo';
//   public tiger = 'hi';
//   public katze = 'hello';
//   public array = [42, 'fdsf', false];
//   public saff = {
//     sfdfd: 'dfdsf'
//   }
// }

// const anything = new Anything();
const anything = [1, 'dfds', false, 232];
const times = 100000;

console.time('fori');
for (let i = 0; i < times; i++) {
  const keys = Object.keys(anything);

  for (let j = 0; j < keys.length; j++) {
    let value = (anything as ObjectType)[keys[j]];
    value = value;
  }
}
console.timeEnd('fori');

console.time('fori values');
for (let i = 0; i < times; i++) {
  const values = Object.values(anything);

  for (let j = 0; j < values.length; j++) {
    let value = values[j];
    value = value;
  }
}
console.timeEnd('fori values');

console.time('forin');
for (let i = 0; i < times; i++) {
  // eslint-disable-next-line @typescript-eslint/no-for-in-array
  for (const key in anything) {
    // if (Object.prototype.hasOwnProperty.call(anything, key)) {
    let value = (anything as ObjectType)[key];
    value = value;
    // }
  }
}
console.timeEnd('forin');


console.time('forof values');
for (let i = 0; i < times; i++) {
  for (const value_ of Object.values(anything)) {
    let value = value_;
    value = value;
  }
}
console.timeEnd('forof values');

console.time('forof entries');
for (let i = 0; i < times; i++) {
  for (const [{}, value_] of Object.entries(anything)) {
    let value = value_;
    value = value;
  }
}
console.timeEnd('forof entries');

const array: ArrayLike<number> = {
  0:1,
  1:2,
  2:3,
  length: 3
};

console.log(Object.keys(array))

console.time('fori array');
for (let i = 0; i < times; i++) {
  for (let j = 0; j < array.length; j++) {
    array[j];
  }
}
console.timeEnd('fori array');

console.time('forof array');
for (let i = 0; i < times; i++) {
  for (const index in array) {
    array[index];
  }
}
console.timeEnd('forof array');

const dic: Dictionary<string> = {
  1: 'hello',
  2: 'you'
};


console.time('forin dic');
for (let i = 0; i < times; i++) {
  for (const key in dic) {
    dic[key];
  }
}
console.timeEnd('forin dic');


console.time('fori dic');
for (let i = 0; i < times; i++) {
  const keys = Object.keys(dic)
  for (let i = 0; i < keys.length; i++) {
    dic[keys[i]];
  }
}
console.timeEnd('fori dic');



console.time('ifelse');
for (let i = 0; i < times; i++) {
  for (const key in dic) {
    if (key === '1') {
      dic[key];
    } else if (key === '2') {
      dic[key];
    } else {
      dic[key];
    }
  }
}
console.timeEnd('ifelse');

console.time('switch');
for (let i = 0; i < times; i++) {
  for (const key in dic) {
    switch (key) {
      case '1':
        dic[key];
        break;
      case '2':
        dic[key];
        break;
      default:
        dic[key];
        break;
    }
  }
}
console.timeEnd('switch');
