# web-graph-ui

Provides a single component export, [FarrellyGraph](src/components/FarrellyGraph.tsx). Given data and props, a 3D graph
node (courtesy of [react-force-graph-3d](https://github.com/vasturiano/react-force-graph)) network will be created.
Showing the links between nodes in the network.

Two playback modes are provided, 'start' and 'end'.

- *start*
    - first node will be the base URL, i.e thefarrelly.com.
    - subsequent nodes will be added every 500ms, until all nodes have been represented.
- *end*
    - all nodes will be represented immediately.

## Installation

Use your package manager of choice, we use pnpm.

```
pnpm add web-graph-ui
```

### Example usage

##### import

```typescript jsx
import FarrellyGraph from 'web-graph-ui';
```

*FarrellyGraph is a default export from the pkg*.

##### Usage

Start mode, begin immediately

```typescript jsx
 <FarrellyGraph
  graphData={dataset}
  beginPlayback={true}
  playbackFrom={'start'}
  config={{width: 640, height: 640}}
/>
```

End mode, begin immediately

```typescript jsx
 <FarrellyGraph
  graphData={dataset}
  beginPlayback={true}
  playbackFrom={'end'}
  config={{width: 640, height: 640}}
/>
```

However, you may want to delay playback. For example, you could allow the user to choose between 'start' and 'end'.

- To allow the user to choose, provide either playback option ('start' | 'end') and then set `beginPlayback` to true,
  e.g.

```typescript jsx
const [playbackOption, setPlaybackOption] = useState<'start' | 'end'>();
...
{
  playbackOption && <FarrellyGraph
    graphData={dataset}
    beginPlayback={!!playbackOption}
    playbackFrom={playbackOption}
    config={{width: 640, height: 640}}
  />
}
```

## Api reference

----

### Input

| Prop          |             Type             |  Default  | Description                                                                                           | Required |
|---------------|:----------------------------:|:---------:|-------------------------------------------------------------------------------------------------------|----------|
| graphData     | GraphData<WebNode, LinkNode> |     -     | Graph node data for each node and it's relations to others. Uses react-force-graph type of same name. | true     |
| beginPlayback |           boolean            |   false   | Will trigger the initial playback                                                                     | true     |
| playbackFrom  |      'start', or 'end'       |     -     | Defines playback from first node, or entire network                                                   | true     |
| config        |     FarrellyGraphConfig      | undefined | Config, can set width/height for the component                                                        | false    |
| onReady       |          () => void          | undefined | Callback that fires when the component is ready (mounted and data loaded)                             | false    |

`graphData` example structure

```json
{
  "nodes": [
    {
      "url": "https://thefarrelly.com",
      "name": "/",
      "id": 1
    },
    {
      "url": "https://thefarrelly.com/posts",
      "name": "/posts",
      "id": 2
    },
    ...
  ],
  "links": [
    {
      "source": 1,
      "target": 2
    },
    ...
  ]
}
```

*This follows the [data structure](https://github.com/vasturiano/react-force-graph#input-json-syntax) defined by
react-force-graph-3d*.

### UI Controls

- Hold click/tap to rotate.
- Pinch/scroll to zoom.
- Click/tap playback (bottom left) to pause, play, restart.
- Click/tap orbit (bottom right) to start, or stop orbit (orbit only during pause/end).
- Click/tap notifications (top right) to hide, or show node info notifications.

## How to run

1. clone repo.
2. install dependencies.
    - `pnpm i`
3. run dev.
    - `pnpm dev`, or `pnpm start`
