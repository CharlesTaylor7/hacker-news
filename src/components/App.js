import React, { useState, useEffect } from 'react';
import './App.css';
import Item from './Item';
import * as HN from '../HackerNewsAPI';

export const UpdateContext = React.createContext({});

const topStoriesLimit = 10;
export const App = () => {
  const [latestId, setLatestId] = useState(null);
  const [stories, setStories] = useState([]);
  const [updates, setUpdates] = useState({});

  useEffect(() => {
    HN.getLatestId().then(setLatestId);
  }, []);

  useEffect(() => {
    if (latestId === null) return;
    async function getNextStory() {
      if (stories.length >= topStoriesLimit) return;
      for (let id = latestId; ; id--) {
        const item = await HN.getItem(id);
        if (item.type === 'story') {
          setStories(stories => [...stories, item]);
          setLatestId(id - 1);
          return;
        }
      }
    }
    getNextStory();
  }, [latestId]);
  return (
    <div className='App'>
      <UpdateContext.Provider value={{ updates, setUpdates }}>
        <header className='App-header'>
          {stories.map(story => (
            <Item key={story.id} item={story} />
          ))}
        </header>
      </UpdateContext.Provider>
    </div>
  );
};
