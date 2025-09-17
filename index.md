---
layout: default
title: Course Quizzes
---

# 📘 Course Quizzes

Welcome! Choose a quiz below:

<ul>
{% assign sorted = site.quizzes | sort: "title" %}
{% for quiz in sorted %}
  <li><a href="{{ quiz.url | relative_url }}">{{ quiz.title }}</a></li>
{% endfor %}
</ul>
