# Logit Refiner

[![ECCV 2026](https://img.shields.io/badge/ECCV-2026-4b2e83)](https://compvis.github.io/logit-refiner/)
[![Project page](https://img.shields.io/badge/Project-Page-2563eb)](https://compvis.github.io/logit-refiner/)
[![Paper PDF](https://img.shields.io/badge/Paper-PDF-b31b1b)](docs/static/paper/logit-refiner.pdf)

<h2 align="center">Improving Visual Autoregressive Models<br>via Intra-Scale Dependency Modeling</h2>

<p align="center">
  <a href="https://scholar.google.com/citations?user=FpT8ECwAAAAJ">Meimingwei Li</a><sup>1,*</sup> ·
  <a href="https://stefan-baumann.eu/">Stefan Andreas Baumann</a><sup>1,2,*</sup> ·
  <a href="https://scholar.google.com/citations?user=2Il9dwMAAAAJ">Felix Krause</a><sup>1,2</sup> ·
  <a href="https://ommer-lab.com/people/ommer/">Björn Ommer</a><sup>1,2</sup>
</p>

<p align="center">
  <sup>1</sup> CompVis @ LMU Munich &nbsp; <sup>2</sup> Munich Center for Machine Learning (MCML)<br>
  <sup>*</sup> Equal contribution
</p>

Logit Refiner improves visual autoregressive image generation by restoring dependencies between tokens within each scale. A lightweight causal transformer samples tokens conditioned on frozen backbone features, improving spatial coherence while keeping the backbone unchanged.

<p align="center">
  <img src="docs/static/images/logit_refiner_teaser.png" alt="Logit Refiner improves spatial coherence in VAR and Infinity samples and lowers FID across VAR backbone sizes" width="100%">
</p>

- **Lightweight:** two causal transformer blocks, approximately 10% additional parameters, and less than 5% of the base model’s training compute.
- **Effective across scales:** improves FID for every tested VAR backbone, from 310M to 2B parameters.
- **Generalizes to text-to-image:** improves spatial coherence with a frozen Infinity-2B backbone at 1024 × 1024 resolution.

**Release status:** The paper and project page are available. Model code and checkpoints are not yet included in this repository.

## Method

VAR predicts all tokens within a scale in parallel, then samples them independently. Logit Refiner restores the missing dependencies by conditioning each token on previously sampled tokens within that scale. Only the small refiner runs sequentially, using KV caching; the backbone still runs once per scale in parallel.

The refiner is trained with teacher forcing on a frozen backbone. Identity initialization preserves the base model’s predictions at the start of training. See the [paper](docs/static/paper/logit-refiner.pdf) for the architecture and controlled ablations.

## Results

### ImageNet, 256 × 256

| Backbone | VAR params | With refiner | VAR FID ↓ | Refined FID ↓ |
| :--- | ---: | ---: | ---: | ---: |
| VAR-d16 | 310M | 356M | 3.30 | **2.81** |
| VAR-d20 | 600M | 671M | 2.57 | **2.17** |
| VAR-d24 | 1.0B | 1.1B | 2.09 | **1.83** |
| VAR-d30 | 2.0B | 2.2B | 1.92 | **1.76** |

Class-conditional generation with 50k samples; classifier-free guidance and top-k are swept individually. Parameter counts include the full model. Lower FID is better.

**VAR-d24 + Refiner outperforms VAR-d30 at roughly half the parameter count.**

<p align="center">
  <img src="docs/static/images/logit_refiner_scaling.png" alt="Paired samples at VAR depths 16, 20, 24, and 30: baseline above, Logit Refiner below; each pair uses the same class and seed" width="100%">
</p>

### Text-to-image and efficiency

On Infinity-2B, the average HPSv3 automated preference score improves from **9.79 to 9.91**, evaluated on 600 images across 12 subsets. Refinement is applied only to early stages, up to 6 × 6 tokens.

For VAR-d16, training the refiner takes **66 H200-hours**. Refining through 10 × 10 tokens retains **99% of the full FID improvement** while reducing refiner overhead by **71%**, relative to full refinement.

See the [project page](https://compvis.github.io/logit-refiner/) for text-to-image examples, full metrics, and quality–speed tradeoffs.

## Citation

```bibtex
@inproceedings{li2026logitrefiner,
  title = {Logit Refiner: Improving Visual Autoregressive Models
           via Intra-Scale Dependency Modeling},
  author = {Li, Meimingwei and Baumann, Stefan Andreas and
            Krause, Felix and Ommer, Bj{\"o}rn},
  booktitle = {European Conference on Computer Vision (ECCV)},
  year = {2026},
  url = {https://compvis.github.io/logit-refiner/}
}
```

[Download BibTeX](docs/static/paper/logit-refiner.bib).
