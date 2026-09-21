### 1. Organization Payroll Analytics Summary (KPI Cards & Analytical Breakdown)                                         
                                                                                                                           
  Resolves the 404 Not Found on /api/v1/org/payroll/analytics. Computes local, international, USDT spend, employee counts, 
  previous-year trend comparisons, and category spend breakdowns.                                                          
                                                                                                                           
  • Method: GET                                                                                                            
  • Route: /api/v1/org/payroll/analytics                                                                                   
  • Headers:                                                                                                               
      • Authorization: Bearer <JWT>                                                                                        
      • X-Organization-Id: <UUID>                                                                                          
  • Query Parameters (Optional):                                                                                           
      • year (integer, optional — defaults to current year, e.g. 2026)                                                     
      • currency (string, optional — defaults to "NGN")                                                                    
                                                                                                                           
                                                                                                                           
  #### Response (200 OK)                                                                                                   
                                                                                                                           
    {                                                                                                                      
      "organizationId": "8110a203-5b06-4eec-8efe-88b451371086",                                                            
      "currency": "NGN",                                                                                                   
      "metrics": {                                                                                                         
        "totalSpendLocal": {                                                                                               
          "amount": 238000909.00,                                                                                          
          "currency": "NGN",                                                                                               
          "trendDescription": "43,000.00 Less than a year"                                                                 
        },                                                                                                                 
        "totalSpendInternational": {                                                                                       
          "amount": 0.00,                                                                                                  
          "currency": "NGN",                                                                                               
          "trendDescription": "0.00 compared to prior year"                                                                
        },                                                                                                                 
        "totalSpendUsdt": {                                                                                                
          "amount": 9.00,                                                                                                  
          "currency": "USDT",                                                                                              
          "trendDescription": "43,000.00 Less than a year"                                                                 
        },                                                                                                                 
        "totalEmployeesPaid": {                                                                                            
          "count": 89,                                                                                                     
          "trendDescription": "+12 compared to last year"                                                                  
        }                                                                                                                  
      },                                                                                                                   
      "breakdown": {                                                                                                       
        "general": [                                                                                                       
          {                                                                                                                
            "id": "spend-breakdown",                                                                                       
            "title": "Payroll spend breakdown",                                                                            
            "description": "92% of your NGN payroll this year was allocated to paying out salaries"                        
          },                                                                                                               
          {                                                                                                                
            "id": "spend-annual",                                                                                          
            "title": "Average payroll spend by annual",                                                                    
            "description": "Annualized payroll expenditure across completed disbursements for 2026 is ₦238,000,909.00."    
          },                                                                                                               
          {                                                                                                                
            "id": "spend-dept",                                                                                            
            "title": "Payroll spend per Department",                                                                       
            "description": "Engineering accounts for 44% of your NGN payroll this year."                                   
          }                                                                                                                
        ],                                                                                                                 
        "payrollSpend": [                                                                                                  
          {                                                                                                                
            "id": "direct-salaries",                                                                                       
            "title": "Direct Salaries Allocation",                                                                         
            "description": "92% allocated towards gross direct salaries and basic allowances."                             
          },                                                                                                               
          {                                                                                                                
            "id": "benefits-tax",                                                                                          
            "title": "Statutory Taxes & Pension",                                                                          
            "description": "8% allocated towards PAYE, NHF, and statutory employee deductions."                            
          }                                                                                                                
        ],                                                                                                                 
        "salariesAnalytics": [                                                                                             
          {                                                                                                                
            "id": "median-salary",                                                                                         
            "title": "Median Monthly Salary",                                                                              
            "description": "The average median salary across active full-time departments is ₦350,000."                    
          },                                                                                                               
          {                                                                                                                
            "id": "top-earning-dept",                                                                                      
            "title": "Top Earning Department",                                                                             
            "description": "Engineering accounts for 44% of total compensation disbursements."                             
          }                                                                                                                
        ],                                                                                                                 
        "othersAnalytics": [                                                                                               
          {                                                                                                                
            "id": "bonus-spend",                                                                                           
            "title": "Discretionary Bonuses & Stipas",                                                                     
            "description": "Zero discretionary bonuses were processed in the current calendar quarter."                    
          },                                                                                                               
          {                                                                                                                
            "id": "contractors",                                                                                           
            "title": "External Contractor Payouts",                                                                        
            "description": "Contractor invoices processed through payroll total ₦1,200,000 this quarter."                  
          }                                                                                                                
        ]                                                                                                                  
      }                                                                                                                    
    }                                                                                                                      
                                                                                                                           
  │ Zero-Data & NaN Protection: When an organization has no previous payroll history or zero disbursements, percentages    
  │ safely return 0% and trend descriptions output clean fallback text (e.g., "Baseline year — no prior historical data"), 
  │ preventing NaN or -Infinity% bugs on UI cards.                                                                         
  ──────                                                                                                                   
  ### 2. Composite Department + Workforce Roles Creation                                                                   
                                                                                                                           
  Allows creating a department and assigning all role chips in a single transactional request (eliminates multiple separate
  network requests).                                                                                                       
                                                                                                                           
  • Method: POST                                                                                                           
  • Route: /api/v1/org/departments/with-roles (or pass roles on existing POST /api/v1/org/departments)                     
  • Headers:                                                                                                               
      • Authorization: Bearer <JWT>                                                                                        
      • X-Organization-Id: <UUID>                                                                                          
                                                                                                                           
                                                                                                                           
  #### Request Body                                                                                                        
                                                                                                                           
    {                                                                                                                      
      "name": "UI/UX Design",                                                                                              
      "description": "Product Design and User Experience",                                                                 
      "roles": [                                                                                                           
        "UI/UX Intern",                                                                                                    
        "Entry Level Designer",                                                                                            
        "Mid Level Designer",                                                                                              
        "Senior Product Designer"                                                                                          
      ]                                                                                                                    
    }                                                                                                                      
                                                                                                                           
  #### Response (201 Created)                                                                                              
                                                                                                                           
    {                                                                                                                      
      "id": "889e88ed-3c5c-4b05-bb92-adb28262a2e5",                                                                        
      "organizationId": "8110a203-5b06-4eec-8efe-88b451371086",                                                            
      "name": "UI/UX Design",                                                                                              
      "description": "Product Design and User Experience",                                                                 
      "roles": [                                                                                                           
        {                                                                                                                  
          "id": "90e2b9c7-5cf7-4f6c-b3a1-778899aabbcc",                                                                    
          "title": "UI/UX Intern"                                                                                          
        },                                                                                                                 
        {                                                                                                                  
          "id": "a1f3c8d8-6df8-4e7d-c4b2-8899aabbccdd",                                                                    
          "title": "Entry Level Designer"                                                                                  
        },                                                                                                                 
        {                                                                                                                  
          "id": "b2e4d9e9-7ef9-4f8e-d5c3-99aabbccddee",                                                                    
          "title": "Mid Level Designer"                                                                                    
        },                                                                                                                 
        {                                                                                                                  
          "id": "c3f5eaf0-8fa0-4a9f-e6d4-aabbccddeeff",                                                                    
          "title": "Senior Product Designer"                                                                               
        }                                                                                                                  
      ],                                                                                                                   
      "createdAtUtc": "2026-09-21T12:00:00Z"                                                                               
    }                                                                                                                      
  ──────                                                                                                                   
  ### 3. Composite Salary Level + Staff Member Assignments                                                                 
                                                                                                                           
  Allows creating a salary tier and immediately assigning staff members in a single request.                               
                                                                                                                           
  • Method: POST                                                                                                           
  • Route: /api/v1/org/levels/with-members (or pass staffMembershipIds on existing POST /api/v1/org/levels)                
  • Headers:                                                                                                               
      • Authorization: Bearer <JWT>                                                                                        
      • X-Organization-Id: <UUID>                                                                                          
                                                                                                                           
                                                                                                                           
  #### Request Body                                                                                                        
                                                                                                                           
    {                                                                                                                      
      "levelName": "Level 10",                                                                                             
      "baseAmount": 500000.00,                                                                                             
      "currency": "NGN",                                                                                                   
      "staffMembershipIds": [                                                                                              
        "01f73c76-dfed-4838-901a-04400e042283",                                                                            
        "78f6c78f-4c89-4981-b45c-f48b2ef82cea"                                                                             
      ]                                                                                                                    
    }                                                                                                                      
                                                                                                                           
  #### Response (201 Created)                                                                                              
                                                                                                                           
    {
      "id": "8c56a0c8-8f61-44d7-850d-88cdb93d7b71",
      "organizationId": "8110a203-5b06-4eec-8efe-88b451371086",
      "levelName": "Level 10",
      "baseAmount": 500000.00,
      "currency": "NGN",
      "assignedStaffCount": 2,
      "createdAtUtc": "2026-09-21T12:00:00Z"
    }