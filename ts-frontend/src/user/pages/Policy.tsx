import React from 'react';
import Button from '../../shared/components/FormElements/Button';
import { useHttpClient } from '../../shared/hooks/http-hook';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import BackButton from '../../shared/components/UIElements/backButton';

const Policy: React.FC = () => {
  const { isLoading } = useHttpClient();

  return (
    <React.Fragment>
      <BackButton />
      <div className="content">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="sidebar">
          <Button to="/auth">Login</Button>
        </div>
        <h1>Privacy Policy</h1>
        <p>
          This service respects your privacy and is committed to protecting it.
          Every company has a privacy policy, but when it comes right down to
          it, we want you to understand how we protect your privacy and to know
          what data we collect and how we use it.
        </p>
        <h2>Overview</h2>
        <p>
          This policy describes the types of information FREETIME may collect
          from you or that you may provide when you visit the website
          freetime.com (collectively, our “Website“). This includes our
          practices for collecting, using, maintaining, protecting, and
          disclosing that information and the basis for doing so.
        </p>
        <p>
          This policy applies to information we collect on the Website, in
          e-mail, text and other electronic messages between you and this
          Website.
        </p>
        <p>
          We reserve the right to make changes to this privacy policy at any
          time by giving notice on this page and/or within this Application
          and/or sending a notice to you via any contact information available
          to us. It is strongly recommended to check this page often, referring
          to the date of the last modification listed at the top.
        </p>
        <h2>Collection and Use of Personal Data</h2>
        FREETIME relies on a number of legal bases to collect, use and otherwise
        process the information we have about you for the purposes described in
        this Privacy Policy. Generally, this includes analytics, user database
        management, managing support and contact requests, transaction
        aggregation, hosting and backend infrastructure and infrastructure
        monitoring.
        <p>We process data:</p>
        <p>
          in order to provide the services. For example, we cannot provide our
          services without an email address to sign into your account, conduct
          customer support, or send educational materials; we cannot provide the
          service without users providing financial information on which a
          budget is based; to protect your vital interests, or those of others,
          such as in the case of emergencies; where you have made the
          information public; where necessary in the public interest; such as
          those of visitors, members or partners; where you provide consent (for
          example, to join email mailing lists).
        </p>
        <p>We also process your data based on our legitimate interest in:</p>
        <p>
          providing a quality service and in improving that service; ensuring
          the services are secure; protection against fraud, spam and abuse,
          etc.; understanding how clients and visitors interact with our
          websites and services, so that we can continuously improve the
          experience and effectiveness of doing so. Categories of data we
          collect We collect information about you, including information that
          directly or indirectly identifies you, through your use of FREETIME.
          We do so:
        </p>
        <p>
          when you provide the information, through filling out forms or
          otherwise providing information on our website; when you correspond
          with us to receive customer support via email or chat.
        </p>
        <p>This includes:</p>
        <p>
          Your email address that you provide to us as a username. Your IP
          address when you interact with our website and apps. Records and
          copies of your correspondence (including e-mail addresses different
          than that used to establish your account), if you contact us. Your
          responses to surveys that we might ask you to complete for research
          purposes. Information that you provide by filling in forms on our
          Website. This includes information provided at the time of registering
          to use our Website, subscribing to our service, or requesting further
          services. We may also ask you for information when you report a
          problem with our Website. To provide you with customer support or
          service offerings, including responding to and resolving your
          inquiries and requests via email or text-based chat.
        </p>
        <p>
          <b>Cookies & technical data</b>
        </p>
        FREETIME collects information as visitors and clients browse and
        interact with the website.
        <h2>Site visitors</h2>
        When you visit our website, we may place a cookie on your browser so
        that our system can recognize you when you make a return visit. Third
        parties may also place cookies on your browser for targeted advertising
        purposes. That cookie allows us to recognize your browser on a return
        visit. We do not otherwise collect or process data when you are a
        Visitor.
        <h2>Signed-in Users</h2>
        To help analyze how you and other visitors navigate FREETIME website,
        and compile aggregate statistics about site usage and response rates,
        we, with assistance from third-party analytics service providers
        (described below), collect certain information when you visit our site.
        This information includes IP address, geographic location of the device,
        browser type, browser language, date and time of your request, time(s)
        of your visit(s), page views and page elements (e.g., links) that you
        click, and other similar data. We may use cookies, pixel tags, and
        tracking scripts on our site or in our email messages to assist us in
        collecting and analyzing such information. We use this information to
        provide better, more relevant content on our site, to measure the
        effectiveness of advertisements, to identify and fix problems, and to
        improve your overall experience on our site.
        <h2>Opting out of Cookies</h2>
        There are a number ways to limit the cookies that your browser accepts
        or limit the way in which they’re used.
        <p>
          One way to limit cookies is by opting out of third party
          cookies/advertising networks, like Google Analytics. If you are in
          Canada or the EU you can use the DAAC’s youradchoices.ca, or EDAA’s
          youronlinechoices.eu respectively. Some people use what are called “Ad
          Blockers” to limit advertising/tracking. We don’t endorse any
          particular Ad Blocker, but want you to know that it’s an option since
          you’re reading this and are likely quite privacy-minded.
        </p>
        <p>
          Opting out of cookies using the above methods likely won’t cause
          problems with our services per se, but it makes it harder for us to
          spend our advertising budget effectively because we won’t know how you
          discovered FREETIME and sometimes won’t even know if you’re already a
          customer of ours. Depending on the services you block, it might also
          make it harder for us to know how you’re using our website, or know if
          you’re running into problems.
        </p>
        <p>
          Another way of limiting cookies is by controlling cookies in your web
          browser’s settings. (Disabling cookies in this way is more likely to
          actually break or worsen the experience when using some of our
          services).
        </p>
        <p>Here are instructions for the most common browsers:</p>
        <p>
          <a
            className="block"
            href="https://support.google.com/chrome/answer/95647?hl=en-GB"
          >
            Google Chrome
          </a>
          <a
            className="block"
            href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies"
          >
            Internet Explorer
          </a>
          <a
            className="block"
            href="https://privacy.microsoft.com/en-us/windows-10-microsoft-edge-and-privacy"
          >
            Microsoft Edge
          </a>
          <a
            className="block"
            href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer#w_cookie-settings"
          >
            Mozilla Firefox
          </a>
          <a
            className="block"
            href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac"
          >
            Safari (Desktop)
          </a>
          <a className="block" href="https://support.apple.com/en-us/HT201265">
            Safari (Mobile)
          </a>
          <a
            className="block"
            href="https://support.google.com/ics/nexus/bin/answer.py?hl=en&answer=2425067"
          >
            Android Browser
          </a>
        </p>
        <h2>Recipients of personal data</h2>
        <p>
          <b>We do not sell users’ data. (And we never have!)</b>
        </p>
        <h2>Analytics</h2>
        FREETIME partners with third-parties to help us monitor and analyze
        website traffic and can be used to keep track of User behavior, helping
        us to improve the services and experience of using them.
        <h2>Customer Support</h2>
        FREETIME partners with third-parties to help us receive, process, and
        respond to customer support requests, as customer support and education
        are a core part of the services offered.
        <h2>Children under the age of 13</h2>
        Our Website is not intended for children under 13 years of age (or 16
        years of age for those who habitually reside in the EU, which applies to
        the remainder of the paragraph that follows). No one under these ages
        may provide any personal information to the Website. We do not knowingly
        collect personal information from children under 13. If you are under
        13, do not use or provide any information on this Website or on or
        through any of its features, register on the Website or provide any
        information about yourself to us, including your name, address,
        telephone number, e-mail address or any screen name or user name you may
        use. If we learn we have collected or received personal information from
        a child under 13 without verification of parental consent, we will
        delete that information. If you believe we might have any information
        from or about a child under 13, please contact us at
        privacy@evoleeq.com.
        <h2>Your Rights</h2>
        <p>
          <b>Deletion</b>
        </p>
        You can always contact us and we will confirm the full deletion of all
        your personal data on our servers.
        <p>
          <b>Adjust Notification and Email Preferences</b>
        </p>
        FREETIME offers various ways to manage the communications you receive.
        Currently we not plan any use of email marketing.
        <p>
          <b>Updating Account Information</b>
        </p>
        You may correct, amend, or update your email and/or password at any time
        by adjusting that information in your account settings.
        <p>
          FREETIME has not and does not transfer information to third parties
          for direct marketing purposes. In the event we decided to do so in the
          future, we would provide affirmative consent and opt-out procedures.
        </p>
        <p>
          <b>EU Visitors and Clients’ Rights</b>
        </p>
        Rights to access, deletion, portability, and restriction are described
        above. In addition, if you habitually reside in the EU and wish to raise
        a concern about our use of your information (and without prejudice to
        any other rights you may have), you have the right to do so with your
        local supervisory authority.
        <h2>Transfers</h2>
        The Service offered by FREETIME is managed in Switzerland. If you are
        located outside of the Switzerland and choose to use the Services or
        provide information to us, you acknowledge and understand that your
        information will be transferred, processed, and stored in the EU.
        <h2>Further reading</h2>
        We take security quite seriously around here, and go into detail about
        the steps we take to protect users data in our Security Policy. If you
        need further assistance, email privacy@evoleeq.com.
      </div>
    </React.Fragment>
  );
};

export default Policy;
