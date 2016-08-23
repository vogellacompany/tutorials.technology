#!/bin/bash

find . -name "article.xml" -exec rename 's/article/001_article/;' '{}' \;
