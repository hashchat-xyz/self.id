# Reading public data

```tsx live noInline
// import { Core } from '@self.id/core'

const core = new Core({ network: 'local-clay' })

function ShowProfileName({ did }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    core
      .get('basicProfile', did)
      .then(setProfile)
      .finally(() => {
        setLoading(false)
      })
  }, [did])

  const text = loading ? 'Loading...' : profile ? `Hello ${profile.name}` : 'Could not load profile'
  return <p>{text}</p>
}

render(
  <ShowProfileName did="did:3:kjzl6cwe1jw148tatgct60tsyreuv36uxdyzn29pazvkvmyhz81w39mq70esv3t" />
)
```