const Loading = () => {
  return (
    <div className='fixed inset-0 flex min-h-screen items-center justify-center bg-slate-950/90'>
      <div className='h-12 w-12 animate-spin rounded-full border-4 border-orange-400/30 border-t-orange-400' />
    </div>
  )
}

export default Loading