#! 

exists?() {
    command -v "$1" >/dev/null 2>&1
}

load-bb() {
    echo "curl -sL https://raw.githubusercontent.com/borkdude/babashka/master/install | sh"
}

bb() {
    if exists? bb; then
        bb "$@"
    else
        echo "Babashka (bb) is not installed. Please install it first."
        load-bb
    fi
}

bb "$@"