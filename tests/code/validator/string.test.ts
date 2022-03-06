import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { StringValidator } from '../../../src/validator/string';

const ig = new InspectorGadget();
const jce = new JestClassExtended(StringValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    3,
    () => {
      expect(ig.string.isValid('hello world')).toBe(true);
      expect(ig.string.isValid(`hello ${'world'}`)).toBe(true);
      expect(ig.string.isValid('')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(ig.string.isValid(undefined)).toBe(false);
      expect(ig.string.isValid(null)).toBe(false);
      expect(ig.string.isValid(42)).toBe(false);
      expect(ig.string.isValid(true)).toBe(false);
      expect(ig.string.isValid({ oh: 'no' })).toBe(false);
      expect(ig.string.isValid(/.*oh.*no:+/)).toBe(false);
      expect(ig.string.isValid(() => ({ oh: 'no' }))).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    31,
    () => {
      expect(ig.string.length(5).isValid('hello')).toBe(true);
      expect(ig.string.length(5).longest(6).isValid('hello')).toBe(true);
      expect(ig.string.length(5).shortest(4).isValid('hello')).toBe(true);
      expect(ig.string.longest(6).shortest(4).isValid('hello')).toBe(true);
      expect(ig.string.accept('world', 'hello').isValid('hello')).toBe(true);
      expect(ig.string.accept('world', /.*hello.*/).isValid('hello')).toBe(true);
      expect(ig.string.reject('world').isValid('hello')).toBe(true);
      expect(ig.string.custom(value_ => value_.endsWith('o') ? undefined : 'invalid').isValid('hello')).toBe(true);
      expect(ig.string.json.isValid('{ "hello": "world" }')).toBe(true);
      expect(ig.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0=')).toBe(true);
      expect(ig.string.date.isValid('2021-01-01')).toBe(true);
      expect(ig.string.numeric.isValid('42')).toBe(true);
      expect(ig.string.uuid.isValid('0cceef42-6b9b-4150-828a-501ef1299578')).toBe(true);

      // just a few simple tests... @sideway/address will do the job

      expect(ig.string.email.isValid('email@example.com')).toBe(true);

      expect(ig.string.uri.isValid('https://github.com/sideway/address')).toBe(true);
      expect(ig.string.uri.isValid('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBe(true);
      expect(ig.string.uri.isValid('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
      expect(ig.string.uri.isValid('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
      expect(ig.string.uri.isValid('news:comp.infosystems.www.servers.unix')).toBe(true);
      expect(ig.string.uri.isValid('tel:+1-816-555-1212')).toBe(true);
      expect(ig.string.uri.isValid('telnet://192.0.2.16:80/')).toBe(true);
      expect(ig.string.uri.isValid('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);

      expect(ig.string.url.isValid('https://github.com/sideway/address')).toBe(true);
      expect(ig.string.url.isValid('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
      expect(ig.string.url.isValid('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBe(true);
      expect(ig.string.url.isValid('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
      expect(ig.string.url.isValid('news:comp.infosystems.www.servers.unix')).toBe(true);
      expect(ig.string.url.isValid('tel:+1-816-555-1212')).toBe(true);
      expect(ig.string.url.isValid('telnet://192.0.2.16:80/')).toBe(true);
      expect(ig.string.url.isValid('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);
      expect(ig.string.url.isValid('urn:ISBN:3-8233-4429-1')).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    23,
    () => {
      expect(ig.string.length(6).isValid('hello')).toBe(false);
      expect(ig.string.length(5).longest(4).isValid('hello')).toBe(false);
      expect(ig.string.length(5).shortest(6).isValid('hello')).toBe(false);
      expect(ig.string.longest(4).shortest(6).isValid('hello')).toBe(false);
      expect(ig.string.accept('world').isValid('hello')).toBe(false);
      expect(ig.string.accept('world', /.+hello.+/).isValid('hello')).toBe(false);
      expect(ig.string.reject('hello').isValid('hello')).toBe(false);
      expect(ig.string.custom(value_ => value_.endsWith('d') ? undefined : 'invalid').isValid('hello')).toBe(false);
      expect(ig.string.json.isValid('{ "hello": world }')).toBe(false);
      expect(ig.string.base64.isValid('eyAiaGVsbG8iOiAid29ybGQiIH0')).toBe(false);
      expect(ig.string.date.isValid('20210101')).toBe(false);
      expect(ig.string.numeric.isValid('42+42')).toBe(false);
      expect(ig.string.uuid.isValid('0cceef42-6b9b-4150828a-501ef1299578')).toBe(false);
      expect(ig.string.rejectEmpty.isValid('')).toBe(false);

      // just a few simple tests... @sideway/address will do the job

      expect(ig.string.email.isValid('email@examplecom')).toBe(false);

      expect(ig.string.url.isValid('192.0.2.16:80')).toBe(false);

      expect(ig.string.uri.isValid('https//github.com/sideway/address')).toBe(false);
      expect(ig.string.uri.isValid('ftp//ftp.is.co.za/rfc/rfc1808.txt')).toBe(false);
      expect(ig.string.uri.isValid('http//www.ietf.org/rfc/rfc2396.txt')).toBe(false);
      expect(ig.string.uri.isValid('ldap//[2001:db8::7]/c=GB?objectClass?one')).toBe(false);
      expect(ig.string.uri.isValid('newscomp.infosystems.www.servers.unix')).toBe(false);
      expect(ig.string.uri.isValid('tel+1-816-555-1212')).toBe(false);
      expect(ig.string.uri.isValid('telnet//192.0.2.16:80/')).toBe(false);
    }
  );
});
