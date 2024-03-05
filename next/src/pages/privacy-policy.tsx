// pages/privacy-policy.js
import { Container, Typography, Paper, List, ListItem } from '@mui/material'
import Head from 'next/head'
import React from 'react'

const PrivacyPolicyPage = () => {
  return (
    <>
      <Head>
        <title> プライバシーポリシー | Switch Mania </title>
      </Head>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h4" gutterBottom>
            プライバシーポリシー
          </Typography>
          <Typography variant="h6" gutterBottom>
            お客様から取得する情報
          </Typography>
          <List>
            <ListItem>氏名(ニックネームやペンネームも含む)</ListItem>
            <ListItem>メールアドレス</ListItem>
            <ListItem>写真や動画</ListItem>
            <ListItem>
              外部サービスでお客様が利用するID、その他外部サービスのプライバシー設定によりお客様が連携先に開示を認めた情報
            </ListItem>
          </List>
          <Typography variant="h6" gutterBottom>
            お客様の情報を利用する目的
          </Typography>
          <List>
            <ListItem>
              当社サービスに関する登録の受付、お客様の本人確認、認証のため
            </ListItem>
            <ListItem>お客様の当社サービスの利用履歴を管理するため</ListItem>
            <ListItem>
              当社サービスにおけるお客様の行動履歴を分析し、当社サービスの維持改善に役立てるため
            </ListItem>
            <ListItem>当社のサービスに関するご案内をするため</ListItem>
            <ListItem>当社の規約や法令に違反する行為に対応するため</ListItem>
            <ListItem>
              当社サービスの変更、提供中止、終了、契約解除をご連絡するため
            </ListItem>
            <ListItem>当社規約の変更等を通知するため</ListItem>
            <ListItem>
              以上の他、当社サービスの提供、維持、保護及び改善のため
            </ListItem>
          </List>
          <Typography variant="h6" gutterBottom>
            安全管理のために講じた措置
          </Typography>
          <Typography paragraph>
            当社が、お客様から取得した情報に関して安全管理のために講じた措置につきましては、末尾記載のお問い合わせ先にご連絡をいただきましたら、法令の定めに従い個別にご回答させていただきます。
          </Typography>

          <Typography variant="h6" gutterBottom>
            第三者提供
          </Typography>
          <Typography paragraph>
            当社は、お客様から取得する情報のうち、個人データ（個人情報保護法第１６条第３項）に該当するものついては、あらかじめお客様の同意を得ずに、第三者（日本国外にある者を含みます。）に提供しません。
            但し、次の場合は除きます。
          </Typography>
          <List>
            <ListItem>個人データの取扱いを外部に委託する場合</ListItem>
            <ListItem>当社や当社サービスが買収された場合</ListItem>
            <ListItem>
              事業パートナーと共同利用する場合（具体的な共同利用がある場合は、その内容を別途公表します。）
            </ListItem>
            <ListItem>
              その他、法律によって合法的に第三者提供が許されている場合
            </ListItem>
          </List>
          <Typography variant="h6" gutterBottom>
            プライバシーポリシーの変更
          </Typography>
          <Typography paragraph>
            当社は、必要に応じて、このプライバシーポリシーの内容を変更します。この場合、変更後のプライバシーポリシーの施行時期と内容を適切な方法により周知または通知します。
          </Typography>
          <Typography variant="h6" gutterBottom>
            お問い合わせ
          </Typography>
          <Typography paragraph>
            お客様の情報の開示、情報の訂正、利用停止、削除をご希望の場合は、以下のメールアドレスにご連絡ください。
          </Typography>
          <Typography paragraph>support@switchmania.com</Typography>
          <Typography paragraph>
            この場合、必ず、運転免許証のご提示等当社が指定する方法により、ご本人からのご請求であることの確認をさせていただきます。なお、情報の開示請求については、開示の有無に関わらず、ご申請時に一件あたり1,000円の事務手数料を申し受けます。
          </Typography>

          <Typography variant="body1">制定日: 2024年01月31日</Typography>
        </Paper>
      </Container>
    </>
  )
}

export default PrivacyPolicyPage
