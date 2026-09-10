# Classroom fonts

- `classroom-sans.woff2`: Noto Sans SC variable, weights 100–900. Source: https://github.com/google/fonts/tree/main/ofl/notosanssc
- `classroom-math.woff2`: STIX Two Text variable, weights 400–700. Source: https://github.com/google/fonts/tree/main/ofl/stixtwotext

Both are redistributed under the SIL Open Font License; the original licenses are included alongside the fonts. They are hosted with the page rather than fetched from a third-party font service.

These WOFF2 files were subset with fontTools from the upstream variable TTFs, retaining all layout features. The subset includes the first lesson's text, shared JavaScript strings, printable ASCII, and mathematical symbols. When adding or editing a lesson, regenerate the subsets from the text of **all** lessons plus shared JavaScript. Missing characters fall back to PingFang SC or Microsoft YaHei until the subsets are updated.

Typography references: [Ant Design](https://ant.design/docs/spec/font-cn/) for font hierarchy and numeric alignment; [W3C Chinese Layout Requirements](https://www.w3.org/International/clreq/) for Chinese punctuation and mixed-script layout considerations. Sizes are adapted to reading and screen sharing, rather than copied from interface defaults.
