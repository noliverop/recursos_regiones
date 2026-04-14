class TrustGitpodOriginMiddleware:
    """
    Rewrite Origin and Referer headers from Gitpod preview domains so Django's
    CSRF middleware treats them as same-origin. Requests arrive via the Vite
    proxy, but the browser still sends the public *.gitpod.dev origin, which
    Django 4.x rejects unless it's listed in CSRF_TRUSTED_ORIGINS (wildcards
    are not supported in Django 4.x).
    """

    TRUSTED_SUFFIXES = ('.gitpod.dev', '.gitpod.io')

    def __init__(self, get_response):
        self.get_response = get_response

    def _is_gitpod(self, value):
        return any(suffix in value for suffix in self.TRUSTED_SUFFIXES)

    def __call__(self, request):
        local_origin = f"{request.scheme}://{request.get_host()}"

        if self._is_gitpod(request.META.get('HTTP_ORIGIN', '')):
            request.META['HTTP_ORIGIN'] = local_origin

        if self._is_gitpod(request.META.get('HTTP_REFERER', '')):
            request.META['HTTP_REFERER'] = local_origin + '/'

        return self.get_response(request)
