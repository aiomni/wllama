import './style.css';

export default function Home() {
  return (
    <div className='chat-home-page'>
      <div className='chat-home-page__content bordered'>
        <h1>Welcome to AI Omni Chat.</h1>
        <div className="chat-home-page__update">
          <h2>Update</h2>
          <h3>Apr 2, 2023</h3>
          <h4>Feature</h4>
          <ol className='update_content'>
            <li>Introducing the <b>/clear</b> command in the channel input. you can use this command to clear the current channel's message. Stay tuned for more upcoming commands!</li>
            <li>Support showing update logs on the homepage, so that you can better use the update history by understanding the changes in website's features.</li>
          </ol>
        </div>
      </div>
    </div>
  )
}