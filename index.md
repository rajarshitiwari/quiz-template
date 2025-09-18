---
layout: default
title: Course Quizzes
---

<h1>📘 Course Quizzes</h1>
<p>Welcome! Choose a quiz below:</p>

<ul>
  {% raw %}{% for quiz in site.quizzes %}
    <li><a href="{{ quiz.url | relative_url }}">{{ quiz.title }}</a></li>
  {% endfor %}{% endraw %}
</ul>
