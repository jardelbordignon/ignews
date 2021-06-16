import { createRef, Component } from 'react'

export default class Comments extends Component {

  commentBox: any

  constructor(props) {
    super(props)
    this.commentBox = createRef<HTMLDivElement>()
  }

  componentDidMount() {
    let script = document.createElement('script')
    script.src = 'https://utteranc.es/client.js'
    script.async = true
    script.setAttribute('crossorigin', 'anonymous')
    script.setAttribute('repo', 'jardelbordignon/ignews')
    script.setAttribute('issue-term', 'url')
    script.setAttribute('label', 'comment :speech_balloon:');
		script.setAttribute('theme', 'photon-dark');
    this.commentBox.current.appendChild(script)
  }

  render() {
    return (
      <div style={{ width: '100%' }} id='comments'>
        <div ref={this.commentBox} />
      </div>
    )
  }
  
}
