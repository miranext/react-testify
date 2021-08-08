# :soon: React Testify

React Testify are set of context providers to make it easier to inject replacement of common global objects.

Warning: early stage and experimental af

## Example Usage

Use it to swap out objects within the global window object.


```typescript

  import { WindowContextProvider } from 'react-testify';

  export function Index() {
    return (
      <WindowContextProvider>
        <App />
      </WindowContextProvider>
    )
  }
```

We can now then use the windowContext from within the children.


```typescript
  import { useWindow } from 'react-testify'
  ...

  export function ItemsView() {
    const [items, setItems] = React.useState<Item>([])
    const window = useWindow()

    const callback = React.callback(async () => {
      const res = await window.fetch('/api/items')
      const data = await res.json()
      setItems(data)
    }, [])

    return (
      <ul>
        { items.map(item => {
          return <li key={item.id}>{item.name}</li>
        })}
      </ul>
    )
  }

```

Now to test we can use the TestWindowContextProvider to provide any partial implementation

```typescript


  // file: EventListener.test.ts
  import { render, screen } from '@testing-ibrary/react'
  import { EventListener } from '../component/EventListner'

  describe('EventListener', () => {

    it('renders events as it comes', () => {

      // example api from your fetch mock implementation
      const fetchMock = createFetchMock()
      fetchMock
        .onGet('/api/items')
        .return([{ id: '1', name: 'Item 1' }])

      render(
        <TestWindowContextProvider fetch={fetchMock.build()}>
          <EventListener />
        </TestWindowContextProvider>
      )

      await screen.findByText('Item 1')
    })
  })


```




