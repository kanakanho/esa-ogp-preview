# esa ogp preview

esa.io で ogp をいい感じに表示するためのwebサービス

# 利用方法

## iframe で埋め込む場合

```html
<iframe
src="https://esa-ogp-preview.kanakanho.workers.dev/ogp?url=https://kanakanho.dev"
></iframe>
```

## 画像として利用する場合

```md
![](https://esa-ogp-preview.kanakanho.workers.dev/ogp/svg?url=https://kanakanho.dev)
```

表示例

![](https://esa-ogp-preview.kanakanho.workers.dev/ogp/svg?url=https://kanakanho.dev)

> [!TIP]
> 画像の場合、クエリパラメータに`width`を指定することで横幅を変更できます。デフォルトは`700`です。

```md
https://esa-ogp-preview.kanakanho.workers.dev/ogp/svg?url=https://kanakanho.dev&width=1000
```

表示例

![](https://esa-ogp-preview.kanakanho.workers.dev/ogp/svg?url=https://kanakanho.dev&width=1000)

> [!TIP]
> クエリパラメータに `img=false` を設定することで ogp 画像の読み込みを無視できます。

```md
https://esa-ogp-preview.kanakanho.workers.dev/ogp/svg?url=https://kanakanho.dev&img=false
```

表示例

![](https://esa-ogp-preview.kanakanho.workers.dev/ogp/svg?url=https://kanakanho.dev&width=1000&img=false)
