

export const ScrollToTop = () => {

    return (
        <>
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 p-4 rounded-full shadow-lg transition-colors z-50"
            >
                <ChevronRight className="w-6 h-6 -rotate-90" />
            </button>
        </>
    )
}

export default ScrollToTop;
