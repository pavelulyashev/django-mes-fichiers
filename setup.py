from distutils.core import setup
from setuptools import find_packages


setup(
    name='django-mes-fichiers',
    version='0.1.1',
    author='Pavel Ulyashev',
    author_email='p.ulyashev@gmail.com',
    license='BSD',
    packages=find_packages(),
    include_package_data=True,
    url='https://github.com/pavelulyashev/django-mes-fichiers',
    description='Manager for files and albums with tinymce integration',
    long_description=open('README.md').read(),
    platforms=['any'],
    install_requires=[
        'Django >= 1.3',
        'djangorestframework',
        'easy_thumbnails',
    ],
    classifiers=[
        'Programming Language :: Python',
        'Framework :: Django',
        'Development Status :: 4 - Beta',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: BSD License',
        'Operating System :: OS Independent',
        'Topic :: Software Development'
    ],
)
