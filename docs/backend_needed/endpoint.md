Route: GET /api/v1/admin/organizations                                                                                        
  • Authorization: Bearer <token> (Requires Admin or SuperAdmin role)                                                             
  • Query Parameters:                                                                                                             
      • pageNumber (int, optional, default 1)                                                                                     
      • pageSize (int, optional, default 10)                                                                                      
      • search (string, optional, filters by name, email, or address)                                                             
      • status (string or int, optional, filters by Verified, Pending, Suspended, Rejected)                                       
      • category (string, optional, filters by industry/category)                                                                 
  • Expected Response DTO (PagedResultOfOrganizationDto):                                                                         
    {                                                                                                                             
      "items": [                                                                                                                  
        {                                                                                                                         
          "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",                                                                           
          "name": "Cebis Tech",                                                                                                   
          "category": "Finance",                                                                                                  
          "email": "CebisTech@gmail.com",                                                                                         
          "address": "Abuja..........",                                                                                           
          "status": "Suspended",                                                                                                  
          "logoUrl": "https://.../logo.png",                                                                                      
          "createdAt": "2026-01-10T12:00:00Z"                                                                                     
        }                                                                                                                         
      ],                                                                                                                          
      "pageNumber": 1,                                                                                                            
      "pageSize": 10,                                                                                                             
      "totalCount": 45,                                                                                                           
      "totalPages": 5,                                                                                                            
      "hasNextPage": true,                                                                                                        
      "hasPreviousPage": false                                                                                                    
    }                                               