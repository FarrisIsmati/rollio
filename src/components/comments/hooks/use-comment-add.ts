// DEPENDENCIES
import React, { ChangeEvent, useState, useEffect } from 'react';

const useCommentAdd = () => {
    const [text, setText] = useState<string>('');

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
    }

    return {
        text,
        handleChange
    }
}

export default useCommentAdd;

// Follow this tut
// https://www.youtube.com/watch?v=3WQUItcK-j0

// Maybe this one too
// https://www.youtube.com/watch?v=oQZJxyMoLws