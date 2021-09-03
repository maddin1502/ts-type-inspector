import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { StringValidator } from '../../../src/validator/string';

const jce = new JestClassExtended(StringValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(tva.string.isValid('hello world')).toBe(true);
      expect(tva.string.isValid(`hello ${'world'}`)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    8,
    () => {
      expect(tva.string.isValid(undefined)).toBe(false);
      expect(tva.string.isValid(null)).toBe(false);
      expect(tva.string.isValid(42)).toBe(false);
      expect(tva.string.isValid(true)).toBe(false);
      expect(tva.string.isValid({ oh: 'no'})).toBe(false);
      expect(tva.string.isValid(/.*oh.*no:+/)).toBe(false);
      expect(tva.string.isValid(() => ({ oh: 'no'}))).toBe(false);
      expect(tva.string.isValid('')).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    14,
    () => {
      expect(tva.string.length(5).isValid('hello')).toBe(true);
      expect(tva.string.length(5).max(6).isValid('hello')).toBe(true);
      expect(tva.string.length(5).min(4).isValid('hello')).toBe(true);
      expect(tva.string.max(6).min(4).isValid('hello')).toBe(true);
      expect(tva.string.allow('world', 'hello').isValid('hello')).toBe(true);
      expect(tva.string.allow('world', /.*hello.*/).isValid('hello')).toBe(true);
      expect(tva.string.deny('world').isValid('hello')).toBe(true);
      expect(tva.string.custom(value_ => value_.endsWith('o') ? undefined : 'invalid').isValid('hello')).toBe(true);
      expect(tva.string.allowEmpty.isValid('')).toBe(true);
      expect(tva.string.json.isValid('{ "hello": "world" }')).toBe(true);
      expect(tva.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0=')).toBe(true);
      expect(tva.string.date.isValid('2021-01-01')).toBe(true);
      expect(tva.string.numeric.isValid('42')).toBe(true);
      expect(tva.string.uuid.isValid('0cceef42-6b9b-4150-828a-501ef1299578')).toBe(true);

      // const validMails = [
      //   'email@example.com',
      //   'firstname.lastname@example.com',
      //   'email@subdomain.example.com',
      //   'firstname+lastname@example.com',
      //   'email@123.123.123.123',
      //   '1234567890@example.com',
      //   'email@example-one.com',
      //   '_______@example.com',
      //   'email@example.name',
      //   'email@example.museum',
      //   'email@example.co.jp',
      //   'firstname-lastname@example.com'
      // ];

      // for (let i = 0; i < validMails.length; i++) {
      //   const validMail = validMails[i];
      //   const isValid = tva.string.email.isValid(validMail);
      //   expect(isValid).toBe(true);
      // }
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    13,
    () => {
      expect(tva.string.length(6).isValid('hello')).toBe(false);
      expect(tva.string.length(5).max(4).isValid('hello')).toBe(false);
      expect(tva.string.length(5).min(6).isValid('hello')).toBe(false);
      expect(tva.string.max(4).min(6).isValid('hello')).toBe(false);
      expect(tva.string.allow('world').isValid('hello')).toBe(false);
      expect(tva.string.allow('world', /.+hello.+/).isValid('hello')).toBe(false);
      expect(tva.string.deny('hello').isValid('hello')).toBe(false);
      expect(tva.string.custom(value_ => value_.endsWith('d') ? undefined : 'invalid').isValid('hello')).toBe(false);
      expect(tva.string.json.isValid('{ "hello": world }')).toBe(false);
      expect(tva.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0')).toBe(false);
      expect(tva.string.date.isValid('20210101')).toBe(false);
      expect(tva.string.numeric.isValid('42+42')).toBe(false);
      expect(tva.string.uuid.isValid('0cceef42-6b9b-4150828a-501ef1299578')).toBe(false);

      // const invalidMails = [
      //   'plainaddress',
      //   '#@%^%#$@#$@#.com',
      //   '@example.com',
      //   'Joe Smith <email@example.com>',
      //   'email.example.com',
      //   'email@example@example.com',
      //   '.email@example.com',
      //   'email.@example.com',
      //   'email..email@example.com',
      //   'あいうえお@example.com',
      //   'email@example.com (Joe Smith)',
      //   // 'email@example',
      //   'email@-example.com',
      //   'email@111.222.333.44444',
      //   'email@example..com',
      //   'Abc..123@example.com'
      // ];

      // for (let i = 0; i < invalidMails.length; i++) {
      //   const invalidMail = invalidMails[i];
      //   const isValid = tva.string.email.isValid(invalidMail);
      //   expect(isValid).toBe(false);
      // }
    }
  );
});
