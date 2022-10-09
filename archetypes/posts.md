---
title: "{{ replace .Name "-" " " | title }}"
date: {{ .Date }}
lastmod: {{ .Date }}
slug: {{ now.Format "2006-01-02" }}-{{ .Name | urlize }}
type: posts
draft: false
categories:
  - default
tags:
  - default
---
