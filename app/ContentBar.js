"use client"
import React, { useState, useEffect, useRef } from 'react';
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';


const ContentBar = ({displayedContent, setDisplayedContent, focusedFeature, setFocusedFeature, stories, points, themes, selectedFeature, setSelectedFeature}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [titleFontSize, setTitleFontSize] = useState(30);
  const titleRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [themeList, setThemeList] = useState([]);
  const [obj, setObj] = useState(null);
  const [objType, setObjType] = useState('');
  const [totalPages, settotalPages] = useState(1);



  function clearContent() {
    setTitle('');
    setDescription('');
    setImage('');
    setThemeList([]);
    setObj(null);
    settotalPages(1);

  }

  useEffect ( ()=> {
    clearContent();
    console.log("displaing content");
    console.log(displayedContent);

    if (displayedContent.length === 0) {
      return;
    }

    setIsOpen(true);
    let id = displayedContent[1];
    console.log("id : "+ id);
    if (displayedContent[0]==='story') {
      setCurrentPage(displayedContent[2] + 2);
      settotalPages( stories[id]['pointsIncluded'].length + 1);
      if (currentPage == 1) {
        setObjType('story');
        setObj(stories[id]);
      } else {
        setObjType('point');
        let pointId = stories[id]['pointsIncluded'][displayedContent[2]];
        setObj(points[pointId]);
      }
      console.log("Setting story");
      
      
    } else if (displayedContent[0]==='theme') {
      console.log("Setting theme");
      setObjType('theme');
      setObj(themes[id]);
    } else if (displayedContent[0]==='point') {
      console.log("Setting point");
      setObjType('point');
      setObj(points[id]);
    } else {
      console.log("not allowed");
    }

    //get info
    console.log(obj);
    
  }, [displayedContent])



  useEffect(()=>{
    console.log("obj change");
    if (obj == null) {
      return;
    }
    setTitle(obj['name']);
    setImage(obj['image']);
    setDescription(obj['desc']);

    if (displayedContent[0]=='point') {
      setThemeList(obj['themes'])
    }

    if (displayedContent[0]=='story') {
      setThemeList(obj['themes'])
    }
  }, [obj])

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fitText = () => {
      const titleElement = titleRef.current;
      if (titleElement) {
        let fontSize = 24;
        titleElement.style.fontSize = `${fontSize}px`;
        
        while (titleElement.scrollHeight > titleElement.clientHeight && fontSize > 16) {
          fontSize--;
          titleElement.style.fontSize = `${fontSize}px`;
        }
        
        setTitleFontSize(fontSize);
      }
    };

    fitText();
    window.addEventListener('resize', fitText);
    return () => window.removeEventListener('resize', fitText);
  }, [title]);

  const handleClose = () => {
    setDisplayedContent([]);
    setSelectedFeature([]);
    setIsOpen(false);
    // You can add any additional close logic here
  };

  const handlePrevious = () => {
    setCurrentPage(currentPage - 1);
    console.log("current page is : " + currentPage);
    setDisplayedContent(['story', selectedFeature[1], displayedContent[2] - 1]);
    let pointIndex =  displayedContent[2] - 1;
    if (pointIndex == -1) {
      setFocusedFeature(["story", selectedFeature[1]]);
    } else {
      let pointId = stories[selectedFeature[1]]['pointsIncluded'][pointIndex];
      setFocusedFeature(["point", pointId]);
    }
    
  };

  const handleNext = () => {
    setCurrentPage(currentPage + 1);
    setDisplayedContent(['story', selectedFeature[1], displayedContent[2] +1]);
    let pointId = stories[selectedFeature[1]]['pointsIncluded'][displayedContent[2] + 1];
    setFocusedFeature(["point", pointId]);
  };

  if (!isOpen) return null;

  return (
    <div className="h-[82%] w-[450px] ml-5 bg-white shadow-lg z-[2] absolute top-[130px] left-0 rounded-xl overflow-hidden flex flex-col">
      <div className="p-4 bg-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex justify-center items-center w-[400px]" >
            <h2 
              ref={titleRef}
              className="font-bold leading-tight mb-2 mt-2 overflow-hidden"
              style={{ 
                fontSize: `${titleFontSize}px`,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </h2>
          </div>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-700  mt-1">
            <IoCloseOutline size={24} />
          </button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="w-full flex justify-center mt-4">
          <img src={image} alt={title} className="w-[90%]"></img>
        </div>
        
        
        <div className="p-4">
          <p className="text-gray-700 mb-4">{description}</p>
          { (objType != 'theme') &&
            <div className="flex flex-wrap gap-2 mb-4">
              {themeList.map((id, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {themes[id]['name']}
                </span>
              ))}
            </div>
          }
          
        </div>
      </div>

      <div className="p-4 bg-gray-100 flex justify-between items-center">
        <button 
          onClick={handlePrevious} 
          className={`text-gray-500 hover:text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === 1}
        >
          <IoChevronBackOutline size={24} />
        </button>
        
        <div className="flex space-x-1">
          {[...Array(totalPages)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${i + 1 === currentPage ? 'bg-blue-500' : 'bg-gray-300'}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext} 
          className={`text-gray-500 hover:text-gray-700 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={currentPage === totalPages}
        >
          <IoChevronForwardOutline size={24} />
        </button>
      </div>
    </div>
  );
};

export default ContentBar;