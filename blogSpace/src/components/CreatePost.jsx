

const CreatePost = () => {

  const handleButton = () => {
    console.log('clicked')
  }

  return (
    <div>
      <button onClick={handleButton} className="border bg-green-400 p-3 border-none rounded-xl cursor-pointer">
        <span className="text-white font-bold font-sans">Create a Post</span>
      </button>
    </div>
  )
}

export default CreatePost