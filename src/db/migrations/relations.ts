import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	accountInNeonAuth: {
		userInNeonAuth: r.one.userInNeonAuth({
			from: r.accountInNeonAuth.userId,
			to: r.userInNeonAuth.id
		}),
	},
	userInNeonAuth: {
		accountInNeonAuths: r.many.accountInNeonAuth(),
		organizationInNeonAuthsViaInvitationInNeonAuth: r.many.organizationInNeonAuth({
			from: r.userInNeonAuth.id.through(r.invitationInNeonAuth.inviterId),
			to: r.organizationInNeonAuth.id.through(r.invitationInNeonAuth.organizationId),
			alias: "userInNeonAuth_id_organizationInNeonAuth_id_via_invitationInNeonAuth"
		}),
		invitationInNeonAuths: r.many.invitationInNeonAuth(),
		organizationInNeonAuthsViaMemberInNeonAuth: r.many.organizationInNeonAuth({
			alias: "organizationInNeonAuth_id_userInNeonAuth_id_via_memberInNeonAuth"
		}),
		memberInNeonAuths: r.many.memberInNeonAuth(),
		sessionInNeonAuths: r.many.sessionInNeonAuth(),
	},
	organizationInNeonAuth: {
		userInNeonAuthsViaInvitationInNeonAuth: r.many.userInNeonAuth({
			alias: "userInNeonAuth_id_organizationInNeonAuth_id_via_invitationInNeonAuth"
		}),
		invitationInNeonAuths: r.many.invitationInNeonAuth(),
		userInNeonAuthsViaMemberInNeonAuth: r.many.userInNeonAuth({
			from: r.organizationInNeonAuth.id.through(r.memberInNeonAuth.organizationId),
			to: r.userInNeonAuth.id.through(r.memberInNeonAuth.userId),
			alias: "organizationInNeonAuth_id_userInNeonAuth_id_via_memberInNeonAuth"
		}),
		memberInNeonAuths: r.many.memberInNeonAuth(),
	},
	invitationInNeonAuth: {
		userInNeonAuth: r.one.userInNeonAuth({
			from: r.invitationInNeonAuth.inviterId,
			to: r.userInNeonAuth.id
		}),
		organizationInNeonAuth: r.one.organizationInNeonAuth({
			from: r.invitationInNeonAuth.organizationId,
			to: r.organizationInNeonAuth.id
		}),
	},
	memberInNeonAuth: {
		organizationInNeonAuth: r.one.organizationInNeonAuth({
			from: r.memberInNeonAuth.organizationId,
			to: r.organizationInNeonAuth.id
		}),
		userInNeonAuth: r.one.userInNeonAuth({
			from: r.memberInNeonAuth.userId,
			to: r.userInNeonAuth.id
		}),
	},
	sessionInNeonAuth: {
		userInNeonAuth: r.one.userInNeonAuth({
			from: r.sessionInNeonAuth.userId,
			to: r.userInNeonAuth.id
		}),
	},
	clicks: {
		link: r.one.links({
			from: r.clicks.linkId,
			to: r.links.id
		}),
	},
	links: {
		clicks: r.many.clicks(),
	},
}))