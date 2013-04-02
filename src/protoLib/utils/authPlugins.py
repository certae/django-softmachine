class PluginMount(type):
    def __init__(cls, name, bases, attrs):
        if not hasattr(cls, 'plugins'):
            # This branch only executes when processing the mount point itself.
            # So, since this is a new plugin type, not an implementation, this
            # class shouldn't be registered as a plugin. Instead, it sets up a
            # list where plugins can be registered later.
            cls.plugins = []
        else:
            # This must be a plugin implementation, which should be registered.
            # Simply appending it to the list is all that's needed to keep
            # track of it later.
            cls.plugins.append(cls)

class PasswordValidator(object):
    """
    Plugins extending this class will be used to validate passwords.
    Valid plugins must provide the following method.
    
    validate(self, password)
    
    Receives a password to test, and either finishes silently or raises a
    ValueError if the password was invalid. The exception may be displayed
    to the user, so make sure it adequately describes what's wrong.
    """
    __metaclass__ = PluginMount

def is_valid_password(password):
    """
    Returns True if the password was fine, False if there was a problem.
    """
    for plugin in PasswordValidator.plugins:
        try:
            plugin().validate(password)
        except ValueError:
            return False
    return True

def get_password_errors(password):
    """
    Returns a list of messages indicating any problems that were found
    with the password. If it was fine, this returns an empty list.
    """
    errors = []
    for plugin in PasswordValidator.plugins:
        try:
            plugin().validate(password)
        except ValueError, e:
            errors.append(str(e))
    return errors

class MinimumLength(PasswordValidator):
    def validate(self, password):
        "Raises ValueError if the password is too short."
        if len(password) < 6:
            raise ValueError('Passwords must be at least 6 characters.')

class SpecialCharacters(PasswordValidator):
    def validate(self, password):
        "Raises ValueError if the password doesn't contain any special characters."
        if password.isalnum():
            raise ValueError('Passwords must contain at least one special character.')

if __name__ == '__main__':
    assert get_password_errors('pass') == ['Passwords must be at least 6 characters.',
                                           'Passwords must contain at least one special character.']
    assert is_valid_password('p@ssword')
