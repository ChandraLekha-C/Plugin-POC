// Inject the CSS styles into the document
const style = document.createElement('style');
style.innerHTML = `
  .popover {
    position: absolute; /* Ensure the popover can float above other elements */
    display: block;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
    max-width: 250px;
    white-space: normal;
    font-family: Arial, sans-serif;
  }

  .popover img {
    max-width: 100%;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  .popover h3 {
    font-size: 16px;
    margin: 5px 0;
    color: #333;
  }

  .popover p {
    margin: 5px 0;
    color: #555;
  }

  .popover .key-points {
    margin-top: 10px;
  }

  .popover .key-points li {
    list-style-type: disc;
    margin-left: 20px;
    color: #444;
  }
`;
document.head.appendChild(style);

// Fetch the list of keywords from the API
fetch('http://localhost:5206/api/Property/name')
  .then(response => response.json())
  .then(data => {
    const keywords = data; // Assuming data is an array of strings.
    addLinksToKeywords(keywords);
  })
  .catch(error => console.error('Error fetching data:', error));

// Add links to keywords in the document
function addLinksToKeywords(keywords) {
  // Get all text nodes in the document
  const bodyTextNodes = getTextNodes(document.body);

  bodyTextNodes.forEach(node => {
    let content = node.textContent;

    // Loop through the keywords
    keywords.forEach(keyword => {
      if (content.includes(keyword)) {
        // Create a hyperlink for the keyword with data-keyword attribute
        const newContent = content.replace(new RegExp(keyword, 'g'), `<a href="#" class="keyword-link" data-keyword="${keyword}">${keyword}</a>`);

        // Replace the text node with the new HTML containing hyperlinks
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newContent;

        node.replaceWith(...tempDiv.childNodes);
      }
    });
  });

  // Add mouseover and mouseout event listeners to keyword links
  document.querySelectorAll('.keyword-link').forEach(link => {
    link.addEventListener('mouseover', (event) => {
      event.preventDefault(); // Prevent default link behavior

      const keyword = event.target.getAttribute('data-keyword');
      showPopover(event.target, keyword);

      // Fetch the data from the API based on the hovered keyword
      fetch(`http://localhost:5206/api/Property/name/${encodeURIComponent(keyword)}`)
        .then(response => response.json())
        .then(data => {
          if (data) {
            popover.innerHTML = `
              <img src="${data.image}" alt="${data.name}">
              <h3>${data.name}</h3>
              <p><strong>Manager:</strong> ${data.managerName}</p>
              <p><strong>Landlord:</strong> ${data.landlordName}</p>
              <p><strong>Building GLA:</strong> ${data.buildingGLA} sq ft</p>
              <p><strong>Occupied GLA:</strong> ${data.occupiedGLA} sq ft</p>
              <p><strong>Address:</strong> ${data.address}</p>
              <p><strong>Postcode:</strong> ${data.postcode}</p>
              <p><strong>Rent:</strong> £${data.rent}</p>
              <div class="key-points">
                <strong>Key Points:</strong>
                <ul>
                  ${data.keyPoints.length > 0 
                    ? data.keyPoints.map(point => `<li>${point}</li>`).join('') 
                    : `<li>No key points available</li>`
                  }
                </ul>
              </div>
            `;
          } else {
            popover.innerHTML = `No information found for <strong>${keyword}</strong>`;
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    });

    // Hide the popover when the mouse leaves
    link.addEventListener('mouseout', () => {
      setTimeout(() => {
        popover.style.display = 'none'; // Hide the popover after a slight delay
      }, 200);
    });
  });
}

// Function to show and position the popover near the keyword
function showPopover(targetElement, keyword) {
  const rect = targetElement.getBoundingClientRect();
  
  // Adjust popover position to ensure it remains visible within the viewport
  const popoverWidth = 250; // Max width of popover
  const popoverHeight = 300; // Approximate height of popover (adjust as needed)

  // Calculate the popover's top and left positions
  let top = rect.top + window.scrollY + 20;
  let left = rect.left + window.scrollX;

  // Ensure the popover is fully visible horizontally
  if (left + popoverWidth > window.innerWidth) {
    left = window.innerWidth - popoverWidth - 20;
  }

  // Ensure the popover is fully visible vertically
  if (top + popoverHeight > window.innerHeight) {
    top = window.innerHeight - popoverHeight - 20;
  }

  popover.style.top = `${top}px`;
  popover.style.left = `${left}px`;

  // Show the popover
  popover.style.display = 'block';
}

// Helper function to get all text nodes
function getTextNodes(element) {
  let textNodes = [];
  for (let node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      textNodes.push(node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      textNodes = textNodes.concat(getTextNodes(node));
    }
  }
  return textNodes;
}

// Pre-create a single popover element to avoid creating/removing it frequently
const popover = document.createElement('div');
popover.classList.add('popover');
popover.style.display = 'none'; // Initially hidden
document.body.appendChild(popover);
