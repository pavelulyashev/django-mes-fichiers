from django import VERSION


if VERSION < (1, 5):
    """django_verbatim is imported here to check if it is installed.
    It is needed because add_to_builtins does not raise exception
    if library does not exist.
    """
    import django_verbatim
    from django.template import add_to_builtins
    add_to_builtins('django_verbatim.templatetags.verbatim')