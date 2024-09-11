import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';

// Define constants for max characters and lines
const MAX_LINES = 4;
const MAX_CHAR_LENGTH = 140; // Including white spaces and line breaks

// Function to truncate text based on character length and maximum lines
const truncateText = (text, maxLength, maxLines) => {
    const lines = text.split('\n'); // Split based on line breaks
    let truncatedText = '';
    let lineCount = 0;
    let charCount = 0;

    for (let i = 0; i < lines.length; i++) {
        if (lineCount >= maxLines || charCount >= maxLength) break; // Break if max lines or characters reached

        const words = lines[i].split(' '); // Split lines into words
        let line = '';

        for (let j = 0; j < words.length; j++) {
            // Check if adding this word exceeds the character limit
            if (charCount + words[j].length + (line ? 1 : 0) > maxLength) break;

            line += (line ? ' ' : '') + words[j];
            charCount += words[j].length + 1; // Add word length + space
        }

        if (line) {
            truncatedText += (truncatedText ? '\n' : '') + line;
            lineCount++;
        }
    }

    // Add ellipsis if text was truncated
    return truncatedText.length < text.length ? truncatedText + '.....' : truncatedText;
};

const PostItem = ({ postID, category, title, description, authorID, thumbnail, bookAuthor, createdAt, updatedAt }) => {
    // Truncate description to max 140 characters (including white spaces) and 4 lines
    const shortDescription = truncateText(description, MAX_CHAR_LENGTH, MAX_LINES);
    
    // Truncate title to a max of 30 characters
    const postTitle = title.length > 30 ? title.substr(0, 30) + '...' : title;

    return (
        <article className="post">
            <div className="post_thumbnail">
                <img src={thumbnail} alt={title} />
            </div>
            <div className="post_content">
                <Link to={`/posts/${postID}`}>
                    <h3>{postTitle}</h3>
                </Link>
                <h5 className='book_author'> ~  {bookAuthor}</h5>
                <div
                    className="post_description"
                    dangerouslySetInnerHTML={{ __html: shortDescription.replace(/(?:\r\n|\t|\r|\n)/g, ' ') }}
                />
                <div className="post_footer">
                    <PostAuthor authorID={authorID} createdAt={createdAt} updatedAt={updatedAt} />
                    <Link to={`/posts/categories/${category}`} className='post_footer_category'>
                        {category}
                    </Link>
                </div>
            </div>
        </article>
    );
};

export default PostItem;
