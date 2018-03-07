# Mapping table

This table represents the mapping results between [Snazzy Contacts](https://snazzycontacts.com) API and **Standard data model**

### Person mapping table

| Proprietary data model        | Standard data model - address |
| :---  | :---  |
| title | title |
| salutation | salutation |
| firstname | firstName |
| - | middleName |
| name | lastName |
| - | gender |
| date_of_birth  | birthday |
| - |  categoryName  |
| private_street | street |
| private_street_number | streetNumber |
| - | unit |
| private_zip_code | zipCode |
| private_town | town |
| - | district |
| private_state | region |
| private_country | country |
| phone | phoneNumber |
| fax | faxNumber |
| email | eMail |
| xing_url, twitter_url, linked_ind_url, googleplus_url, youtube_url, facebook_url, skype | network |
| url | uri |

### Organization mapping table

| Proprietary data model        | Standard data model - address |
| :---  | :---  |
| name | organizationName |
| - |  categoryName  |
| street | street |
| street_number | streetNumber |
| - | unit |
| zip_code | zipCode |
| town | town |
| town_area | district |
| state | region |
| country | country |
| phone | phoneNumber |
| fax | faxNumber |
| email | eMail |
| xing_url, twitter_url, linked_ind_url, googleplus_url, youtube_url, facebook_url, skype | network |
| url | uri |
