---
layout: about
title: about
permalink: /
description: PhD student at KIT working on graph neural modeling for deformable object manipulation — physics-informed graph neural simulators (IGNS, ICLR 2026) and geometry-aware reinforcement learning (HEPi, ICLR 2025 Oral).
subtitle: PhD Student in Machine Learning and Robotics at <a href='https://kit.edu'>Karlsruhe Institute of Technology</a>.

profile:
  align: right
  image: prof_pic.jpg
  image_circular: false # crops the image to make it circular
  more_info: >
    <p>4th Floor InformatiKOM 1.</p>
    <p>Adenauerring 12, Karlsruhe</p>

cloth_hero: true

announcements:
  enabled: true
  scrollable: true # adds a vertical scroll bar if there are more than 3 news items
  limit: 5 # leave blank to include all the news in the `_news` folder

selected_papers: true # includes a list of papers marked as "selected={true}"
social: true # includes social icons at the bottom of the page
---

I'm a PhD student at the [Autonomous Learning Robot (ALR) group](https://alr-kit.de/) at KIT, advised by Prof. [Gerhard Neumann](https://alr-kit.de/team/geri/). Previously, I was a research assistant at the [Volkswagen Machine Learning Research Lab](https://argmax.ai/), working with Dr. [Maximilian Karl](https://scholar.google.com/citations?user=noekAeoAAAAJ) and Prof. [Patrick van der Smagt](https://scholar.google.com/citations?user=5ybzvbsAAAAJ) on world models and model-based reinforcement learning. I hold an M.Sc. from TU Munich and a B.Sc. from the University of Information Technology, Vietnam.

## research

I make robots handle things that bend, drape, and tangle. Deformable objects have too many degrees of freedom and dynamics too complex to write down by hand — so I model them as **graphs, with geometry and physics as inductive biases**. Two questions organize the work:

<div class="research-questions">
  <a class="rq-card" href="https://thobotics.github.io/neural_pde_matching/">
    <span class="rq-question">How does the object move?</span>
    <span class="rq-name">IGNS</span>
    <span class="rq-desc">Graph neural simulators with port-Hamiltonian structure: long-range interactions without information forgetting, and stable long rollouts.</span>
    <span class="rq-venue">ICLR 2026</span>
  </a>
  <a class="rq-card" href="https://thobotics.github.io/hepi/">
    <span class="rq-question">How should we act?</span>
    <span class="rq-name">HEPi</span>
    <span class="rq-desc">Equivariant policies on heterogeneous graphs: one lightweight policy across shapes and poses, rigid or deformable.</span>
    <span class="rq-venue rq-award">ICLR 2025 · Oral (top 1.8%)</span>
  </a>
</div>

Also in the lab: meta-learned graph simulators ([MaNGO](https://alrhub.github.io/mango/), NeurIPS 2025), diffusion policies for massively parallel RL (ICML 2026), and world models for model-based RL. Full list on the [publications](/publications/) page.
