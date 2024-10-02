import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../styles/AnalystClaim.module.css'; 



type AnalystClaim = {
  id: number;
  authors: string;
  source: string;
  publicationYear: string;
  evidenceClaim: string;
  evidenceResult: string;
};

const ShowAnalystClaims: React.FC = () => {
  const [claims, setClaims] = useState<AnalystClaim[]>([]); 

  useEffect(() => {
    
    fetch('http://localhost:8082/api')
      .then((res) => res.json())
      .then((data) => {
        setClaims(data);
      })
      .catch((err) => {
        console.error('Error fetching analyst claims:', err);
      });
  }, []); 

  
  const claimsList =
    claims.length === 0
      ? 'There are no analyst claims!'
      : claims.map((claim, index) => (
          <div key={index} className={styles.claimCard}>
            <p><strong>Authors:</strong> {claim.authors}</p>
            <p><strong>Source:</strong> {claim.source}</p>
            <p><strong>Year:</strong> {claim.publicationYear}</p>
            <p><strong>Claim:</strong> {claim.evidenceClaim}</p>
            <p><strong>Result:</strong> {claim.evidenceResult}</p>
          </div>
        ));

  return (
    <div className='ShowAnalystClaims'>
      <div className='container'>
        <div className='row'>
          <div className='col-md-12'>
            <br />
            <h2 className='display-4 text-center'>Analyst Claims List</h2>
          </div>
          <div className='col-md-11'>
            {}
            <Link href='/create-analyst-claim' className='btn btn-outline-warning float-right'>
              + Add New Analyst Claim
            </Link>
            <br />
            <br />
            <hr />
          </div>
        </div>
        {}
        <div className='list'>{claimsList}</div>
      </div>
    </div>
  );
};

export default ShowAnalystClaims;