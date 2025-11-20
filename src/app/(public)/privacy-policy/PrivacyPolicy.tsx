'use client'

import { Container, Typography, Box } from '@mui/material'
import React from 'react'

function PrivacyPolicy() {
    const policies = [
        {
            sectionTitle: 'TERMS OF USE',
            content: [
                "Welcome to this website and the other websites located at Groundwire.net, JesusCares.com, ajesúsleimporta.com, and groundwire.echoglobal.org domains (the “Sites”). The Sites are owned and operated by Champion Ministries dba Groundwire (“Groundwire”, “we” or “us”). The Sites provide you with various opportunities to learn about Groundwire, submit content, and participate in related activities (the “Services”).",
            ],
        },
        {
            sectionTitle: '1. YOUR ACCEPTANCE',
            content: [
                {
                    subtitle: '1.1. Acceptance.',
                    text: `By accessing or otherwise using the Sites and the Services you accept, without modification, these Terms of Use (“Terms of Use” or “Terms”). If you do not agree to these Terms of Use, then please exit immediately from the Sites and do not return.`,
                },
                {
                    subtitle: '1.2. Privacy and Acceptable Use Policies.',
                    text: `These Terms incorporate by reference the Groundwire Privacy Policy located here. Please read the terms of the Privacy Policy carefully, as by agreeing to these Terms, you also agree to the terms of the Privacy Policy.`,
                },
                {
                    subtitle: '1.3. Other Agreements.',
                    text: `Additionally, these Terms incorporate by reference all other Groundwire policies, rules, guidelines, terms, and conditions (“Agreements”) on the Sites, whether established by Champion Ministries or by operators of subnetworks within Groundwire (“Subnetwork Operators”). Read carefully all Agreements before engaging in any corresponding services. You agree to comply with all such Agreements when you agree to comply with the Terms.`,
                },
                {
                    subtitle: '1.4. Changes to these Terms.',
                    text: "We reserve the right, at our sole discretion, to change, modify, add, or delete portions of these Terms of Use at any time without further notice. Your continued use of the Service or the Sites after any such changes means you agree to the new Terms. If we make material changes to the Terms, we will post the changes to these Terms of Use on this page and will indicate at the top of this page the date these terms were last revised. If you do not agree to abide by any future Terms of Use, do not continue to access or otherwise use the Services or the Sites. It is your responsibility to regularly check this page to determine if there have been changes to these Terms of Use and to ensure your compliance therewith.",
                },
            ],
        },
        {
            sectionTitle: '2. CONTENT',
            content: [
                "All of the content on the Sites including, without limitation, text, graphics, user interfaces, visual interfaces, photographs, moving images, illustrations, files, trademarks, logos, service marks, sounds, music, artwork, and computer code, design, structure, selection, coordination, “look and feel” and arrangement of such content (“Content”), is owned by Groundwire, its licensors, vendors, agents, or content providers. All elements of the Sites are protected by copyright, trademark, trade dress, moral rights, or other intellectual property regimes and are NOT considered public domain.",
            ],
        },
        {
            sectionTitle: '3. ACCURACY OF INFORMATION',
            content: [
                "You agree that you will not provide any false, misleading, or inaccurate information to Groundwire, or any of its representatives. You agree that all of the information you provide is accurate to the best of your knowledge. You agree that you will not transmit any information or words that are abusive, obscene, profane, offensive, threatening, or harassing. Your use of the Site may be suspended or terminated immediately upon receipt of any allegation that you have used the Site in violation of these Terms of Use.",
            ],
        },
        {
            sectionTitle: '4. LIMITATIONS TO THESE TERMS',
            content: [
                "The Sites and Services may contain links to third-party websites that are not owned or controlled by Groundwire. All such links are provided solely as a convenience to you. Groundwire has no control over, and assumes no responsibility for, the content, products, services, policies, or practices of any third-party websites. Groundwire does not endorse, guarantee, or make any representations or warranties regarding any other websites. By using the Sites and Services, you expressly relieve Groundwire from any and all liability arising from your use of any third-party website.",
            ],
        },
        {
            sectionTitle: "ADVERTISEMENTS",
            content: ["Groundwire has the exclusive right to market, offer, and place advertisements and/or other promotional content or materials ('Advertisements') on the Sites for its sole benefit. Groundwire will not and will not allow any third party, directly or indirectly, to market, offer, sell, and place Advertisements on the Sites."]
          },
          {
            sectionTitle: "TERMINATION",
            content: [
              {
                subtitle: "Termination",
                text: "Groundwire may suspend or terminate your account or your use of the Sites or any Network at any time, without notice, for any reason or no reason. It may also block your access to the Sites in the event of: (a) a breach of these Terms of Use; or (b) actions that may cause financial loss or legal liability for you, our Users, us, or any other entity."
              },
              {
                subtitle: "Effects of Termination",
                text: "Upon termination, your rights to access and use the Sites and Services automatically terminate. Groundwire is under no obligation to delete, remove, or retain your User Submissions. Even if deleted from active display, User Submissions may be archived by Groundwire."
              }
            ]
          },
          {
            sectionTitle: "YOUR REPRESENTATIONS AND WARRANTIES",
            content: [
              "You possess all consents and rights to grant the licenses stated in these Terms.",
              "You agree to abide by these Terms of Use.",
              "Your User Submissions and their use will not infringe third-party rights.",
              "By uploading Content, you grant Groundwire an unlimited, irrevocable, worldwide license to use and distribute the Content."
            ]
          },
          {
            sectionTitle: "DISCLAIMERS",
            content: [
              "Your use of the Sites and Services is at your own risk. The Sites and Services are provided 'as is' without warranties of any kind.",
              "Groundwire disclaims liability for errors, interruptions, unauthorized access, viruses, or product defects.",
              "Groundwire does not guarantee any specific sales or results from using the Sites or Services.",
              "The Sites are not intended for children under 13, and no personal information from children under 13 is knowingly collected."
            ]
          },
          {
            sectionTitle: "LIMITATION OF LIABILITY",
            content: [
              "Groundwire is not liable for consequential, indirect, incidental, or special damages arising from these Terms of Use or the Sites.",
              "Groundwire’s aggregate liability is limited to $100 or the value of your purchase, whichever is greater.",
              "Any cause of action related to the Sites must commence within one year of occurrence."
            ]
          },
          {
            sectionTitle: "INDEMNITY",
            content: [
              "You will indemnify and hold Groundwire harmless from any claims, losses, liabilities, or expenses arising from:",
              "Your use or inability to use the Sites, Services, or products.",
              "Your User Submissions violating third-party rights.",
              "Any product you list or sell, including damages caused by such products.",
              "Your violation of laws or these Terms of Use."
            ]
          },
          {
            sectionTitle: "ABILITY TO ACCEPT TERMS OF USE",
            content: ["You affirm that you are over 18, or an emancipated minor, or possess legal parental/guardian consent, and are capable of agreeing to these Terms. The Sites are not for users under the age of 13."]
          },
          {
            sectionTitle: "GENERAL",
            content: [
              "These Terms of Use are governed by the laws of Colorado. The state and federal courts of Douglas County, Colorado, have exclusive jurisdiction over disputes.",
              "Groundwire does not guarantee continuous, uninterrupted access to the Sites or Services.",
              "Provisions intended to survive termination of these Terms will remain in effect."
            ]
          },
          {
            sectionTitle: "MINISTRY BY TEXT PARTNERS",
            content: [
              {
                subtitle: "SMS Privacy Policy and Terms of Use",
                text: [
                  "By subscribing, you consent to receive text messages from Groundwire about alerts, event reminders, and donation requests. Message frequency varies by events/preferences.",
                  "Message and data rates may apply. Carriers are not liable for delayed or undeliverable messages."
                ]
              },
              {
                subtitle: "OPT-OUT OR STOP",
                text: "To stop receiving messages, reply STOP to any text message or contact us at 5743160229 or followup@groundwire.net."
              },
              {
                subtitle: "HELP OR SUPPORT",
                text: "Reply HELP to any text message for support. Messages may include links requiring a web browser and internet access."
              },
              {
                subtitle: "SUPPORTED CARRIERS",
                text: "Supported by major carriers like AT&T, Verizon, T-Mobile, etc. T-Mobile is not liable for delayed or undeliverable messages."
              }
            ]
        },
        {
            sectionTitle: "Privacy Policy",
            content: ["We respect your privacy and will not distribute your mobile phone number to any third parties. Service provided by Ministry By Text, LLC."]
          },
          {
            sectionTitle: "Privacy Statement",
            content: ["Thank you for visiting www.groundwire.net. We appreciate the opportunity to interact with you on the Internet and are committed to protecting and safeguarding your privacy. The purpose of this Privacy Statement is to inform you about the types of information we might collect about you when you visit our Site, how we may use that information and whether we disclose that information to anyone. By visiting our sites you are accepting, without modification, this privacy policy. If you do not agree to any portion of this privacy policy, then please exit the site. We reserve the right to change, modify, add or delete the terms of our privacy policy from time to time without further notice. Your continued use of the sites following the posting of changes to this privacy policy means you agree to the new terms."]
          },
          {
            sectionTitle: "What Information We Collect and How We Use It",
            content: ["Any information we collect on our Site generally falls into the Personally Identifiable Information category. Personally Identifiable Information refers to information that lets us know specifically who you are. We collect and store information that you enter into the Site or that you provide through other channels to the Organization. For example, when you make a financial donation online, we collect and store some or all of the following information that you provide, for example: name, address, email address, telephone number. Personal Information may also be collected in certain portions of the Site in which you specifically and knowingly provide such information to us (i.e., online chats). All chats are electronically recorded for the protection of both parties. To improve our service to you chats are recorded for other Groundwire coaches to read. In general, you can visit our Site without telling us who you are or revealing any Personally Identifiable Information. We may also collect and store information about you that we receive from other sources to enable us to update and correct the information contained in our database and to provide information that we think will interest you. If you have agreed to receive emails from us, we may send you reminders about opportunities."]
          },
          {
            sectionTitle: "Anonymous Information",
            content: ["Through your use of the Sites, we may also gather certain information that does not identify you individually ('Anonymous Information'). Generally, this information is collected through 'traffic data.' We collect and store certain other information automatically whenever you interact with the Site, including your IP address, browser information, and reference site domain name. We also collect information regarding user-traffic patterns and site usage. This information is used to analyze and improve the Sites and provide a fulfilling experience."]
          },
          {
            sectionTitle: "Sharing Your Information",
            content: ["Except as disclosed in this Privacy Statement, we do not sell, trade, rent, or otherwise retransmit any Personally Identifiable Information we collect online unless we have your permission. From time to time, we may use things from chat conversations or emails in our marketing and promotion - but when we do so we will never disclose the identification of the person who made the comments and will try to ensure that the general public will not be able to identify the person who made the comments unless we have obtained specific permission from the individual concerned."]
          },
          {
            sectionTitle: "Emergency Situations",
            content: ["We may also use or disclose Personal Information if required to do so by law or in the good-faith belief that such action is necessary to: (a) conform to applicable law or comply with legal process served on us or the Site; (b) protect and defend our rights or property, the Site or our users; and (c) act under emergency circumstances to protect the personal safety of us, our affiliates, agents, or the users of the Sites or the public. This may include sharing information with other companies, lawyers, courts, or government entities."]
          },
          {
            sectionTitle: "Children and Privacy",
            content: ["Our Website is not intentionally targeted to children under the age of 13. If you are under the age of 13, we would prefer you to use the Sites only under the immediate supervision of a parent or guardian, but we realize that this is not always possible or appropriate."]
          },
          {
            sectionTitle: "Security of Information",
            content: ["Personal Information collected by the Site is stored in secure operating environments that are not available to the public. Only those employees or volunteers who need access to your Personal Information to do their jobs are allowed access. While we try our best to safeguard your Personal Information once we receive it, you understand and agree that no transmission of data over the Internet or any other public network can be guaranteed to be 100% secure."]
          },
          {
            sectionTitle: "Links To Other Websites",
            content:[ "Links to third-party Websites may be provided solely for your information and convenience, or to provide additional information for various other goods and services. This Privacy Statement does not cover the information practices of those Websites linked to our Site, nor do we control their content or privacy policies. We suggest that you carefully review the privacy policies of each site you visit."]
          },
          {
            sectionTitle: "Changes to This Statement",
            content: ["Any updates or changes to the terms of this Privacy Statement will be posted here on our Site. Please check back frequently to see if this Privacy Statement has changed. By using our Site, you acknowledge acceptance of this Privacy Statement in effect at the time of use."]
          },
          {
            sectionTitle: "Contact Us",
            content: ["If you have any concerns about our use of your information or about this Privacy Statement, please contact us through the website, and we will look into any concerns that you bring to our attention."]
          }
    ];
        return (
            <Container maxWidth="lg" sx={{ my: 5 }}>
                <Typography variant="h4" textAlign="center" fontWeight="600" gutterBottom>
                    TERMS OF USE & PRIVACY POLICY
                </Typography>
      
                <Box mt={3}>
                    {policies.map((policy, index) => (
                        <Box key={index} mt={3}>
                            <Typography variant="h5" gutterBottom>
                                {policy?.sectionTitle}
                            </Typography>
                            {policy?.content?.length > 0 && policy?.content?.map((item:any, idx:any) =>
                                typeof item === 'string' ? (
                                    <Typography key={idx} variant="body1" paragraph>
                                        {item}
                                    </Typography>
                                ) : (
                                    <Box key={idx} mt={2}>
                                        <Typography variant="subtitle1" fontWeight="600">
                                            {item?.subtitle}
                                        </Typography>
                                        <Typography variant="body1" paragraph>
                                            {item?.text}
                                        </Typography>
                                    </Box>
                                )
                            )}
                        </Box>
                    ))}
                </Box>
            </Container>
        );

}
export default PrivacyPolicy;
