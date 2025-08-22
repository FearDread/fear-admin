

export const Loader = () => {

    return (
        <>
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="flex space-x-1 text-6xl text-white">
            {['L', 'o', 'a', 'd', 'i', 'n', 'g'].map((letter, index) => (
              <span
                key={index}
                className={`animate-bounce`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>

        </>
    )
}