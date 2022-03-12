import { JestClassExtended } from 'jest-class-extended';
import url from 'url';
import { TypeInspector } from '../../../src/inspector';
import { StringValidator } from '../../../src/validator/string';

const ti = new TypeInspector();
const jce = new JestClassExtended(StringValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    3,
    () => {
      expect(ti.string.isValid('hello world')).toBe(true);
      expect(ti.string.isValid(`hello ${'world'}`)).toBe(true);
      expect(ti.string.isValid('')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(ti.string.isValid(undefined)).toBe(false);
      expect(ti.string.isValid(null)).toBe(false);
      expect(ti.string.isValid(42)).toBe(false);
      expect(ti.string.isValid(true)).toBe(false);
      expect(ti.string.isValid({ oh: 'no' })).toBe(false);
      expect(ti.string.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ti.string.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    32,
    () => {
      expect(ti.string.length(5).isValid('hello')).toBe(true);
      expect(ti.string.length(5).longest(6).isValid('hello')).toBe(true);
      expect(ti.string.length(5).shortest(4).isValid('hello')).toBe(true);
      expect(ti.string.longest(6).shortest(4).isValid('hello')).toBe(true);
      expect(ti.string.accept('world', 'hello').isValid('hello')).toBe(true);
      expect(ti.string.accept('world', /.*hello.*/).isValid('hello')).toBe(true);
      expect(ti.string.reject('world').isValid('hello')).toBe(true);
      expect(ti.string.custom(value_ => value_.endsWith('o') ? undefined : 'invalid').isValid('hello')).toBe(true);
      expect(ti.string.json.isValid('{ "hello": "world" }')).toBe(true);
      expect(ti.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0=')).toBe(true);
      expect(ti.string.date.isValid('2021-01-01')).toBe(true);
      expect(ti.string.numeric.isValid('42')).toBe(true);
      expect(ti.string.uuid.isValid('0cceef42-6b9b-4150-828a-501ef1299578')).toBe(true);
      expect(ti.string.hex.isValid('789789424ab89032ab438409ff')).toBe(true);

      // just a few simple tests... @sideway/address will do the job

      expect(ti.string.email.isValid('email@example.com')).toBe(true);

      expect(ti.string.uri.isValid('https://github.com/sideway/address')).toBe(true);
      expect(ti.string.uri.isValid('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBe(true);
      expect(ti.string.uri.isValid('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
      expect(ti.string.uri.isValid('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
      expect(ti.string.uri.isValid('news:comp.infosystems.www.servers.unix')).toBe(true);
      expect(ti.string.uri.isValid('tel:+1-816-555-1212')).toBe(true);
      expect(ti.string.uri.isValid('telnet://192.0.2.16:80/')).toBe(true);
      expect(ti.string.uri.isValid('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);

      expect(ti.string.url.isValid('https://github.com/sideway/address')).toBe(true);
      expect(ti.string.url.isValid('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
      expect(ti.string.url.isValid('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBe(true);
      expect(ti.string.url.isValid('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
      expect(ti.string.url.isValid('news:comp.infosystems.www.servers.unix')).toBe(true);
      expect(ti.string.url.isValid('tel:+1-816-555-1212')).toBe(true);
      expect(ti.string.url.isValid('telnet://192.0.2.16:80/')).toBe(true);
      expect(ti.string.url.isValid('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);
      expect(ti.string.url.isValid('urn:ISBN:3-8233-4429-1')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    24,
    () => {
      expect(ti.string.length(6).isValid('hello')).toBe(false);
      expect(ti.string.length(5).longest(4).isValid('hello')).toBe(false);
      expect(ti.string.length(5).shortest(6).isValid('hello')).toBe(false);
      expect(ti.string.longest(4).shortest(6).isValid('hello')).toBe(false);
      expect(ti.string.accept('world').isValid('hello')).toBe(false);
      expect(ti.string.accept('world', /.+hello.+/).isValid('hello')).toBe(false);
      expect(ti.string.reject('hello').isValid('hello')).toBe(false);
      expect(ti.string.custom(value_ => value_.endsWith('d') ? undefined : 'invalid').isValid('hello')).toBe(false);
      expect(ti.string.json.isValid('{ "hello": world }')).toBe(false);
      expect(ti.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0')).toBe(false);
      expect(ti.string.date.isValid('20210101')).toBe(false);
      expect(ti.string.numeric.isValid('42+42')).toBe(false);
      expect(ti.string.uuid.isValid('0cceef42-6b9b-4150828a-501ef1299578')).toBe(false);
      expect(ti.string.rejectEmpty.isValid('')).toBe(false);
      expect(ti.string.hex.isValid('789789424abxx032ab438409ff')).toBe(false);

      // just a few simple tests... @sideway/address will do the job

      expect(ti.string.email.isValid('email@examplecom')).toBe(false);

      expect(ti.string.url.isValid('192.0.2.16:80')).toBe(false);

      expect(ti.string.uri.isValid('https//github.com/sideway/address')).toBe(false);
      expect(ti.string.uri.isValid('ftp//ftp.is.co.za/rfc/rfc1808.txt')).toBe(false);
      expect(ti.string.uri.isValid('http//www.ietf.org/rfc/rfc2396.txt')).toBe(false);
      expect(ti.string.uri.isValid('ldap//[2001:db8::7]/c=GB?objectClass?one')).toBe(false);
      expect(ti.string.uri.isValid('newscomp.infosystems.www.servers.unix')).toBe(false);
      expect(ti.string.uri.isValid('tel+1-816-555-1212')).toBe(false);
      expect(ti.string.uri.isValid('telnet//192.0.2.16:80/')).toBe(false);
    }
  );

  jce.test(
    { name: 'URL' },
    1,
    () => {
      Reflect.set(global, 'URL', undefined);
      Reflect.set(url, 'URL', undefined);

      expect(ti.string.url.isValid('https://github.com/sideway/address')).toBe(false);
    }
  );
});
