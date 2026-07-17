import type { DefaultValidator } from './index.js';
import { DefaultBigIntValidator } from './bigint.js';
import { DefaultBooleanValidator } from './boolean.js';
import { DefaultCustomValidator } from './custom.js';
import { DefaultDateValidator } from './date.js';
import { DefaultNumberValidator } from './number.js';
import { DefaultStringValidator } from './string.js';

/**
 * Builds fresh instances of the standard validators used as cast targets.
 *
 * This class is instantiated by the inspector at bootstrap (once) and handed to
 * {@link DefaultValidator} via `DefaultValidator.useCastFactories`. That
 * indirection breaks the import cycle that would otherwise arise from the base
 * class referencing its own concrete subclasses: the base only needs the TYPE
 * of this class, while the concrete constructors live here - in a module that
 * is loaded AFTER all validator classes are defined.
 *
 * @export
 * @class CastFactories
 * @since 4.1.0
 */
export class CastFactories {
  public string(): DefaultStringValidator {
    return new DefaultStringValidator();
  }

  public number(): DefaultNumberValidator {
    return new DefaultNumberValidator();
  }

  public boolean(): DefaultBooleanValidator {
    return new DefaultBooleanValidator();
  }

  public bigint(): DefaultBigIntValidator {
    return new DefaultBigIntValidator();
  }

  public date(): DefaultDateValidator {
    return new DefaultDateValidator();
  }

  /**
   * A typed pass-through validator (returns its input unchanged). Used by
   * `asType` when no concrete follow-up validator is supplied.
   */
  public passthrough(): DefaultValidator<unknown> {
    return new DefaultCustomValidator(() => undefined);
  }
}
